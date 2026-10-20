import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { toHexPubkey } from '../utils'
const { InputSpec, Value, List } = sdk

const inputSpec = InputSpec.of({
  pubkeys: Value.list(
    List.text(
      {
        name: i18n('Allowed Uploader Pubkeys'),
        description: i18n(
          'Nostr public keys (npub1… or 64-character hex) allowed to upload, mirror and delete blobs. Leave empty to block all uploads. Anyone can still download existing blobs.',
        ),
        default: [],
      },
      {
        placeholder: 'npub1…',
        patterns: [
          {
            regex: '^\\s*(npub1[02-9ac-hj-np-z]{58}|[0-9a-fA-F]{64})\\s*$',
            description: i18n(
              'Must be an npub1… key or a 64-character hex public key',
            ),
          },
        ],
      },
    ),
  ),
})

export const setWhitelist = sdk.Action.withInput(
  'set-whitelist',
  {
    name: i18n('Uploader Whitelist'),
    description: i18n(
      'Choose which Nostr pubkeys may upload to this server. Until at least one is set, nobody can upload.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  inputSpec,
  async ({ effects }) => ({
    pubkeys: (await storeJson.read((s) => s.whitelist).once()) ?? [],
  }),
  async ({ effects, input }) => {
    const cleaned = input.pubkeys.map((p) => p.trim()).filter(Boolean)
    // Validate fully (incl. npub checksum) before saving.
    for (const p of cleaned) toHexPubkey(p)
    await storeJson.merge(effects, { whitelist: [...new Set(cleaned)] })
  },
)
