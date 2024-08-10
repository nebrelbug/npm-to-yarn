import { yarnToNPM } from './yarnToNpm'
import { npmToYarn } from './npmToYarn'
import { npmToPnpm } from './npmToPnpm'
import { npmToBun } from './npmToBun'

import { highlight } from './highlight.js'

/**
 * Converts between npm and yarn command
 */
export default function convert (str: string, to: 'npm' | 'yarn' | 'pnpm' | 'bun', highlighting = false, theme : "light" | "dark" = "dark"): string {
  if (to === 'npm') {
    const convertedCommand = str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM)
    if (highlighting)
      return highlight(convertedCommand, theme)
    
    return convertedCommand
  } else if (to === 'pnpm') {
    const convertedCommand = str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToPnpm)
    if (highlighting)
      return highlight(convertedCommand, theme)

    return convertedCommand
  } else if (to === 'bun') {
    const convertedCommand = str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToBun)
    if (highlighting)
      return highlight(convertedCommand, theme)

    return convertedCommand
  } else {
    const convertedCommand = str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn)
    if (highlighting)
      return highlight(convertedCommand, theme)

    return convertedCommand
  }
}
