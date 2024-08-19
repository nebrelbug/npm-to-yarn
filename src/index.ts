import { yarnToNPM, pnpmToNpm, bunToNpm } from './toNpm'
import { npmToYarn, pnpmToYarn, bunToYarn } from './toYarn'
import { npmToPnpm, yarnToPnpm, bunToPnpm } from './toPnpm'
import { npmToBun, yarnToBun, pnpmToBun } from './toBun'

import { getManager, isOtherManagerCommand } from './lib'

/**
 * Converts between npm and yarn command
 */
export default function convert (str: string, to: 'npm' | 'yarn' | 'pnpm' | 'bun'): string {
  if (to === 'npm') {
    return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM)
  } else if (to === 'pnpm') {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToPnpm)
  } else if (to === 'bun') {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToBun)
  } else {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn)
  }
}
