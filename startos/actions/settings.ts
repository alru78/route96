import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { DEFAULT_MAX_UPLOAD_MIB } from '../utils'
const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  maxUploadMib: Value.number({
    name: i18n('Maximum Upload Size'),
    description: i18n(
      'Largest single blob route96 will accept. Larger uploads are rejected.',
    ),
    default: DEFAULT_MAX_UPLOAD_MIB,
    required: true,
    integer: true,
    min: 1,
    max: 51200,
    units: 'MiB',
  }),
  customPublicUrl: Value.text({
    name: i18n('Custom Public URL (advanced)'),
    description: i18n(
      'Only needed if your public address is not one of the Blossom interface addresses StartOS knows about (for example an external reverse proxy). Overrides the "Set Public URL" choice. Leave empty to use that choice.',
    ),
    default: null,
    required: false,
    placeholder: 'https://blossom.example.com',
    patterns: [
      {
        regex: '^https?://[^\\s/]+(/[^\\s]*)?$',
        description: i18n('Must be an http:// or https:// URL'),
      },
    ],
  }),
})

export const serverSettings = sdk.Action.withInput(
  'server-settings',
  {
    name: i18n('Server Settings'),
    description: i18n('Maximum upload size and an optional custom public URL.'),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  inputSpec,
  async ({ effects }) => {
    const s = await storeJson.read().once()
    return {
      maxUploadMib: s?.maxUploadMib ?? DEFAULT_MAX_UPLOAD_MIB,
      customPublicUrl: s?.customPublicUrl ?? null,
    }
  },
  async ({ effects, input }) => {
    const custom = input.customPublicUrl?.trim().replace(/\/+$/, '') || null
    await storeJson.merge(effects, {
      maxUploadMib: input.maxUploadMib,
      customPublicUrl: custom,
    })
  },
)
