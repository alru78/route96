import { setWhitelist } from '../actions/whitelist'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const whitelistTask = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await sdk.action.createOwnTask(effects, setWhitelist, 'important', {
      reason: i18n(
        'Add at least one uploader pubkey. Until then nobody can upload to this server.',
      ),
    })
  }
})
