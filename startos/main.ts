import { configYaml } from './fileModels/config.yaml'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { primaryUrl } from './primaryUrl'
import { sdk } from './sdk'
import {
  apiPort,
  CONFIG_DIR,
  CONFIG_PATH,
  DB_NAME,
  MARIADB_DATADIR,
  MIB,
  NOBODY_SENTINEL,
  STORAGE_DIR,
  toHexPubkeys,
} from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting route96'))

  const store = await storeJson.read().const(effects)
  if (!store) throw new Error(i18n('store.json not found'))

  const chosenUrl = await primaryUrl.bestUsable(effects).const()
  const publicUrl = (
    store.customPublicUrl ||
    chosenUrl ||
    `http://127.0.0.1:${apiPort}`
  ).replace(/\/+$/, '')

  const whitelist = toHexPubkeys(store.whitelist)
  const maxUploadBytes = Math.round(store.maxUploadMib * MIB)

  // Regenerate route96's config.yaml from store.json on every start.
  await configYaml.write(effects, {
    listen: `0.0.0.0:${apiPort}`,
    database: `mysql://root:${store.dbPassword}@127.0.0.1:3306/${DB_NAME}`,
    storage_dir: STORAGE_DIR,
    max_upload_bytes: maxUploadBytes,
    public_url: publicUrl,
    // Never omit this key: an absent whitelist means "anyone may upload".
    whitelist: whitelist.length ? whitelist : [NOBODY_SENTINEL],
  })

  const mariaSub = sdk.SubContainer.of(
    effects,
    { imageId: 'mariadb' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'mysql',
      subpath: null,
      mountpoint: MARIADB_DATADIR,
      readonly: false,
    }),
    'mariadb-sub',
  )

  const route96Sub = sdk.SubContainer.of(
    effects,
    { imageId: 'route96' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: STORAGE_DIR,
        readonly: false,
      })
      .mountVolume({
        volumeId: 'startos',
        subpath: null,
        mountpoint: CONFIG_DIR,
        readonly: true,
      }),
    'route96-sub',
  )

  const dbEnv = { MYSQL_PWD: store.dbPassword }

  return sdk.Daemons.of(effects)
    .addDaemon('mariadb', {
      subcontainer: mariaSub,
      exec: {
        command: sdk.useEntrypoint(['--bind-address=127.0.0.1']),
        env: {
          MARIADB_ROOT_PASSWORD: store.dbPassword,
          MARIADB_DATABASE: DB_NAME,
          MARIADB_AUTO_UPGRADE: '1',
        },
      },
      ready: {
        display: i18n('Database'),
        gracePeriod: 120_000,
        fn: async () => {
          // TCP only comes up once the entrypoint's init phase is done.
          const { exitCode } = await mariaSub.exec(
            ['mariadb-admin', '-h', '127.0.0.1', '-uroot', 'ping'],
            { env: dbEnv },
          )
          return exitCode === 0
            ? { result: 'success', message: i18n('The database is ready') }
            : { result: 'starting', message: i18n('Starting the database…') }
        },
      },
      requires: [],
    })
    .addOneshot('sync-db-config', {
      // route96 layers a DB `config` table *over* config.yaml and only seeds it
      // with INSERT IGNORE, so a value changed via a StartOS action would be
      // shadowed by the first-run value forever. Drop the keys StartOS manages;
      // route96 re-seeds them from config.yaml as it starts.
      subcontainer: mariaSub,
      exec: {
        command: [
          'sh',
          '-c',
          `if mariadb -h127.0.0.1 -uroot -N -e "SHOW TABLES LIKE 'config'" ${DB_NAME} | grep -q config; then ` +
            `mariadb -h127.0.0.1 -uroot ${DB_NAME} -e "DELETE FROM config WHERE \\\`key\\\` IN ('public_url','max_upload_bytes')"; fi`,
        ],
        env: dbEnv,
      },
      requires: ['mariadb'],
    })
    .addDaemon('route96', {
      subcontainer: route96Sub,
      exec: {
        command: sdk.useEntrypoint(['--config', CONFIG_PATH]),
        env: { RUST_LOG: 'info' },
      },
      ready: {
        display: i18n('Blossom API'),
        gracePeriod: 60_000,
        fn: () =>
          sdk.healthCheck.checkWebUrl(effects, `http://127.0.0.1:${apiPort}/`, {
            successMessage: i18n('The Blossom API is responding'),
            errorMessage: i18n('The Blossom API is not responding'),
          }),
      },
      requires: ['mariadb', 'sync-db-config'],
    })
    .addHealthCheck('uploads', {
      ready: {
        display: i18n('Uploads'),
        fn: async () =>
          whitelist.length
            ? {
                result: 'success',
                message: i18n('${n} whitelisted uploader(s); max ${size} MiB', {
                  n: String(whitelist.length),
                  size: String(store.maxUploadMib),
                }),
              }
            : {
                result: 'disabled',
                message: i18n(
                  'No uploader pubkeys set, so all uploads are rejected. Run the Uploader Whitelist action.',
                ),
              },
      },
      requires: ['route96'],
    })
    .addHealthCheck('public-url', {
      ready: {
        display: i18n('Public URL'),
        fn: async () => ({
          result: 'success',
          message: i18n('Blob URLs are advertised as ${url}', {
            url: publicUrl,
          }),
        }),
      },
      requires: ['route96'],
    })
})
