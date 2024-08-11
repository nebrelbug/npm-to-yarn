import { yarnToNPM } from './yarnToNpm'
import { npmToYarn } from './npmToYarn'
import { npmToPnpm } from './npmToPnpm'
import { npmToBun } from './npmToBun'

import { codeToHtml } from "shiki"

/**
 * Converts between npm and yarn command
 */
export function convert(str: string, to: 'npm' | 'yarn' | 'pnpm' | 'bun'): string {
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

/**
 * Returns highlighted html string
 */
export async function highlight(command: string, theme: "light" | "dark" = "light") {
  const html = await codeToHtml(command, {
    lang: 'javascript',
    theme: `github-${theme}`
  })

  console.log(await html)
}