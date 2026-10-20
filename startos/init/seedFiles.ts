import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await storeJson.merge(effects, {
      // URL-safe charset: it is embedded in route96's mysql:// connection URL.
      dbPassword: utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 32 }),
      whitelist: [],
      customPublicUrl: null,
    })
  } else {
    await storeJson.merge(effects, {})
  }
})
