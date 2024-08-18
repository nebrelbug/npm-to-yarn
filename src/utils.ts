export const unchangedCLICommands = [
  'test',
  'login',
  'logout',
  'link',
  'unlink',
  'publish',
  'cache',
  'start',
  'stop',
  'test'
]

export const yarnCLICommands = [
  'init',
  'run',
  'add',
  'audit',
  'autoclean',
  'bin',
  'check',
  'config',
  'create',
  'dedupe',
  'generate-lock-entry',
  'global',
  'help',
  'import',
  'info',
  'install',
  'licenses',
  'list',
  'lockfile',
  'outdated',
  'owner',
  'pack',
  'policies',
  'prune',
  'remove',
  'self-update',
  'tag',
  'team',
  'upgrade',
  'upgrade-interactive',
  'version',
  'versions',
  'why',
  'workspace',
  'workspaces'
]

export const npmCLICommands = [
  'init',
  'run',
  'access',
  'adduser',
  'audit',
  'bin',
  'bugs',
  'build',
  'bundle',
  'ci',
  'completion',
  'config',
  'dedupe',
  'deprecate',
  'dist-tag',
  'docs',
  'doctor',
  'edit',
  'explore',
  'exec',
  'fund',
  'help-search',
  'help',
  'hook',
  'install-ci-test',
  'install-test',
  'install',
  'ls',
  'list',
  'npm',
  'org',
  'outdated',
  'owner',
  'pack',
  'ping',
  'prefix',
  'profile',
  'prune',
  'rebuild',
  'repo',
  'restart',
  'root',
  'run-script',
  'search',
  'shrinkwrap',
  'star',
  'stars',
  'start',
  'stop',
  'team',
  'token',
  'uninstall',
  'unpublish',
  'update',
  'version',
  'view',
  'whoami'
]

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