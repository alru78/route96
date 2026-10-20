import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { blossomInterfaceId, mainHostId } from './utils'

// The URL route96 advertises in blob descriptors (`url` field of BUD-02
// responses). Chosen from the Blossom interface's own StartOS addresses, so a
// StartTunnel clearnet domain bound to that interface shows up here.
export const primaryUrl = sdk.setupPrimaryUrl({
  id: 'set-public-url',
  hostId: mainHostId,
  interfaceId: blossomInterfaceId,
  metadata: {
    name: i18n('Set Public URL'),
    description: i18n(
      'Choose which address route96 puts into blob URLs it hands to Nostr clients. Pick your public (StartTunnel) domain so other people can load your media.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  field: { name: i18n('Public URL'), description: null },
  get: storeJson.read((s) => s.publicUrl),
  set: (effects, url) => storeJson.merge(effects, { publicUrl: url }),
})
