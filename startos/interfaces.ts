import { i18n } from './i18n'
import { primaryUrl } from './primaryUrl'
import { sdk } from './sdk'
import { apiPort, blossomInterfaceId, mainHostId } from './utils'

export const setInterfaces = sdk.setupInterfaces(async ({ effects }) => {
  const multi = sdk.MultiHost.of(effects, mainHostId)
  const origin = await multi.bindPort(apiPort, { protocol: 'http' })
  const preferredLauncherAddress = await primaryUrl.bestUsable(effects).const()

  const blossom = sdk.createInterface(effects, {
    name: i18n('Blossom API'),
    id: blossomInterfaceId,
    description: i18n(
      'Blossom / NIP-96 HTTP API (and the route96 web UI at /). Bind your StartTunnel clearnet domain to this interface.',
    ),
    type: 'ui',
    masked: false,
    schemeOverride: null,
    username: null,
    path: '',
    query: {},
    preferredLauncherAddress,
  })

  return [await origin.export([blossom])]
})
