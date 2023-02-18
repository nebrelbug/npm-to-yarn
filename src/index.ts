import { yarnToNPM } from './yarnToNpm'
import { npmToYarn } from './npmToYarn'
import { npmToPnpm } from './npmToPnpm'

/**
 * Converts between npm and yarn command
 */
export default function convert (str: string, to: 'npm' | 'yarn' | 'pnpm'): string {
  if (to === 'npm') {
    return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM)
  } else if (to === 'pnpm') {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToPnpm)
  } else {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn)
  }
}
