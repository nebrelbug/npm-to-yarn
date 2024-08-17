import { yarnToNPM } from './yarnToNpm'
import { npmToYarn } from './npmToYarn'
import { npmToPnpm } from './npmToPnpm'
import { npmToBun } from './npmToBun'

type Command = 'npm' | 'yarn' | 'pnpm' | 'bun'

/**
 * Converts between npm and yarn command
 */
export function convert (str: string, to: 'npm' | 'yarn' | 'pnpm' | 'bun'): string {
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


export const convertMultiple = (str: string | string[], to: Command | Command[]): string[] => {
  const commands : string[] = []

  // one to many
  if (typeof str === 'string' && Array.isArray(to)) {
    to.forEach((t, index) => {
      commands.push(convert(str, to[index]))
    })
  }
  // many to one
  else if (Array.isArray(str) && typeof to === 'string') {
  }
  // many to many
  else if (Array.isArray(str) && Array.isArray(to)) {
  }

  return commands
}

export type { Command }