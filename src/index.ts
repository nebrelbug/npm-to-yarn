import { yarnToNPM } from './yarnToNpm'
import { npmToYarn } from './npmToYarn'
import { npmToPnpm } from './npmToPnpm'
import { npmToBun } from './npmToBun'

import { executorCommands } from './utils'

/**
 * Converts between npm and yarn command
 */
export default function convert(str: string, to: 'npm' | 'yarn' | 'pnpm' | 'bun', executor: boolean = false): string {
  if (to === 'npm') {
    return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM)
  } else if (to === 'pnpm') {
    if (executor) {
      return str.replace("npx", executorCommands["pnpm"])
    }
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToPnpm)
  } else if (to === 'bun') {
    if (executor) {
      return str.replace("npx", executorCommands["bun"])
    }
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToBun)
  } else {
    if (executor) {
      return str.replace("npx", executorCommands["yarn"])
    }
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn)
  }
}