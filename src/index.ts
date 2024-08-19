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

    // pnpm | bun to npm
    if (isOtherManagerCommand(str)) {
      const manager = getManager(str)
      if (manager === 'pnpm') {
        return str.replace(/pnpm(?: +([^&\n\r]*))?/gm, pnpmToNpm)
      } else if (manager === 'bun') {
        return str.replace(/bun(?: +([^&\n\r]*))?/gm, bunToNpm)
      }
    }

    // yarn to npm
    return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM)
  } else if (to === 'pnpm') {

    // yarn | bun to pnpm
    if (isOtherManagerCommand(str)) {
      const manager = getManager(str)
      if (manager === 'yarn') {
        return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToPnpm)
      } else if (manager === 'bun') {
        return str.replace(/bun(?: +([^&\n\r]*))?/gm, bunToPnpm)
      }
    }

    // npm to pnpm
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToPnpm)
  } else if (to === 'bun') {

    // yarn | pnpm to bun
    if (isOtherManagerCommand(str)) {
      const manager = getManager(str)
      if (manager === 'yarn') {
        return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToBun)
      } else if (manager === 'pnpm') {
        return str.replace(/pnpm(?: +([^&\n\r]*))?/gm, pnpmToBun)
      }
    }

    // npm to bun
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToBun)
  } else {

    // pnpm | bun to yarn
    if (isOtherManagerCommand(str)) {
      const manager = getManager(str)
      if (manager === 'pnpm') {
        return str.replace(/pnpm(?: +([^&\n\r]*))?/gm, pnpmToYarn)
      } else if (manager === 'bun') {
        return str.replace(/bun(?: +([^&\n\r]*))?/gm, bunToYarn)
      }
    }

    // npm to yarn
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn)
  }
}
