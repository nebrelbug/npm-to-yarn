import { yarnToNPM } from './yarnToNpm'
import { npmToYarn } from './npmToYarn'

/**
 * Converts between npm and yarn command
 */
export default function convert(str: string, to: 'npm' | 'yarn'): string {
  if (to === 'npm') {
    return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM)
  } else {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn)
  }
}
