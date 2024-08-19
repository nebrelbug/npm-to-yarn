/**
 * Returns the current package manager
 */
export function getManager(command: string): 'npm' | 'yarn' | 'pnpm' | 'bun' {
  if (command.startsWith('yarn')) {
    return 'yarn'
  } else if (command.startsWith('pnpm')) {
    return 'pnpm'
  } else if (command.startsWith('bun')) {
    return 'bun'
  }
  return 'npm'
}

/**
 * Checks whether the command is other than npm command
 */
export function isOtherManagerCommand(command: string): boolean {
  const currentManager = getManager(command)
  return currentManager !== 'npm'
}