import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'
import { DEFAULT_MAX_UPLOAD_MIB } from '../utils'

// StartOS-side state. config.yaml for route96 is generated from this on every
// start (see main.ts), so this file is the single source of truth.
const shape = z.looseObject({
  /** MariaDB root password, generated at install. */
  dbPassword: z.string(),
  /** Address chosen with the "Set Public URL" action (one of the interface's addresses). */
  publicUrl: z.string().optional().catch(undefined),
  /** Optional free-form override, for a URL StartOS doesn't know about. */
  customPublicUrl: z.string().nullable().catch(null),
  /** Uploader pubkeys exactly as entered (npub or hex). Empty = nobody may upload. */
  whitelist: z.array(z.string()).catch([]),
  maxUploadMib: z.number().catch(DEFAULT_MAX_UPLOAD_MIB),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: '/store.json' },
  shape,
)
