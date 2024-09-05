import { yarnToNPM } from './yarnToNpm'
import { npmToYarn } from './npmToYarn'
import { npmToPnpm } from './npmToPnpm'
import { npmToBun } from './npmToBun'
import { executorCommands } from './utils'

type Command = 'npm' | 'yarn' | 'pnpm' | 'bun'

/**
 * Converts between npm and yarn command
 */

export function convert (str: string, to: 'npm' | 'yarn' | 'pnpm' | 'bun'): string {
  if (to === 'npm') {

export default function convert (str: string, to: 'npm' | 'yarn' | 'pnpm' | 'bun'): string {
  if (
    str.includes('npx') ||
    str.includes('yarn dlx') ||
    str.includes('pnpm dlx') ||
    str.includes('bun x')
  ) {
    const executor = str.includes('npx')
      ? 'npx'
      : str.includes('yarn dlx')
      ? 'yarn dlx'
      : str.includes('pnpm dlx')
      ? 'pnpm dlx'
      : 'bun x'
    return str.replace(executor, executorCommands[to])
  } else if (to === 'npm') {

    return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM)
  } else if (to === 'pnpm') {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToPnpm)
  } else if (to === 'bun') {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToBun)
  } else {
    return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn)
  }
}


export function convertMultiple (str: string | string[], to: Command | Command[]): string[] {
  const commands : string[] = []

  // one to many
  if (typeof str === 'string' && Array.isArray(to)) {
    to.forEach((t) => {
      commands.push(convert(str, t))
    })
  }
  // many to one
  else if (Array.isArray(str) && typeof to === 'string') {
    str.forEach((s) => {
      commands.push(convert(s, to))
    })
  }
  // many to many
  else if (Array.isArray(str) && Array.isArray(to)) {
    to.forEach((t) => {
      str.forEach((s) => {
        commands.push(convert(s, t))
      })
    })
  }

  return commands
}

export type { Command }