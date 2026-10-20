import { actions } from '../actions'
import { restoreInit } from '../backups'
import { dependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { sdk } from '../sdk'
import { versionGraph } from '../versions'
import { publicUrlTask } from './publicUrlTask'
import { seedFiles } from './seedFiles'
import { whitelistTask } from './whitelistTask'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  seedFiles,
  setInterfaces,
  actions,
  publicUrlTask,
  whitelistTask,
  dependencies,
)

export const uninit = sdk.setupUninit(versionGraph)
