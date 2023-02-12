import { yarnToNPM } from './yarnToNpm'
import { npmToYarn } from './npmToYarn'

/**
 * Converts yarn to npm command
 */
export function convertToNpm(str: string) {
  return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM)
}

/**
 * Converts npm to yarn command
 */
export function convertToYarn(str: string) {
  return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn)
}

/**
 * Converts between npm and yarn command
 */
export default function convert(str: string, to: 'npm' | 'yarn'): string {
  if (to === 'npm') {
    return convertToNpm(str)
  } else {
    return convertToYarn(str)
  }
}
