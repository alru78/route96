import { VersionGraph } from '@start9labs/start-sdk'
import { current } from './current'
import { v0_7_0_0 } from './v0_7_0_0'
import { v0_7_0_1 } from './v0_7_0_1'

export const versionGraph = VersionGraph.of({
  current,
  other: [v0_7_0_1, v0_7_0_0],
})
