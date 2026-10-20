import { primaryUrl } from '../primaryUrl'
import { sdk } from '../sdk'
import { serverSettings } from './settings'
import { setWhitelist } from './whitelist'

export const actions = sdk.Actions.of()
  .addAction(setWhitelist)
  .addAction(primaryUrl.action)
  .addAction(serverSettings)
