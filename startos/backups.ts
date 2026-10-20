import { storeJson } from './fileModels/store.json'
import { sdk } from './sdk'
import { DB_NAME, MARIADB_DATADIR } from './utils'

export const { createBackup, restoreInit } = sdk.setupBackups(async () =>
  sdk.Backups.withMariadbDump({
    imageId: 'mariadb',
    dbVolume: 'mysql',
    datadir: MARIADB_DATADIR,
    database: DB_NAME,
    user: 'root',
    password: async () => {
      const pw = await storeJson.read((s) => s.dbPassword).once()
      if (!pw) throw new Error('No database password found in store.json')
      return pw
    },
  })
    .addVolume('main')
    .addVolume('startos'),
)
