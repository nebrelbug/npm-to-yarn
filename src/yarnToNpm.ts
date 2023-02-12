import { unchangedCLICommands, yarnCLICommands } from './utils'

const yarnToNpmTable = {
  add(command: string, global?: true) {
    let dev
    if (command === 'add --force') {
      return 'rebuild'
    }
    let ret = command
      .replace('add', 'install')
      .replace(/\s*--dev/, function () {
        dev = true
        return ''
      })
      .replace('--no-lockfile', '--no-package-lock')
      .replace('--optional', '--save-optional')
      .replace('--exact', '--save-exact')
    if (dev) {
      ret += ' --save-dev'
    } else if (global) {
      ret += ' --global'
    } else {
      ret += ' --save'
    }
    return ret
  },
  remove(command: string, global?: true) {
    let dev
    let ret = command
      .replace('remove', 'uninstall')
      .replace(/\s*--dev/, function () {
        dev = true
        return ''
      })
      .replace('--no-lockfile', '--no-package-lock')
      .replace('--optional', '--save-optional')
      .replace('--exact', '--save-exact')
    if (dev) {
      ret += ' --save-dev'
    } else if (global) {
      ret += ' --global'
    } else {
      ret += ' --save'
    }
    return ret
  },
  version(command: string) {
    return command.replace(/--(major|minor|patch)/, '$1')
  },
  install: 'install',
  list(command: string) {
    return command
      .replace(/--pattern ["']([^"']+)["']/, function (_, packages: string) {
        return packages.split('|').join(' ')
      })
      .replace(/^list/, 'ls')
  },
  init: 'init',
  create: 'init',
  run: 'run',
  start: 'start',
  stop: 'stop',
  test: 'test',
  global(command: string) {
    if (/^global add/.test(command)) {
      return yarnToNpmTable.add(command.replace(/^global add/, 'add'), true)
    } else if (/^global remove/.test(command)) {
      return yarnToNpmTable.remove(command.replace(/^global remove/, 'remove'), true)
    }
    return 'npm ' + command + "\n# couldn't auto-convert command"
  },
}

export function yarnToNPM(_m: string, command: string): string {
  command = (command || '').trim()
  if (command === '') {
    return 'npm install'
  }
  const firstCommand = (/\w+/.exec(command) || [''])[0]

  if (unchangedCLICommands.includes(firstCommand)) {
    return 'npm ' + command
  }

  if (firstCommand in yarnToNpmTable) {
    const converter = yarnToNpmTable[firstCommand as keyof typeof yarnToNpmTable]

    if (typeof converter === 'function') {
      return 'npm ' + converter(command)
    } else {
      return 'npm ' + command.replace(firstCommand, converter)
    }
  } else if (!yarnCLICommands.includes(firstCommand)) {
    // i.e., yarn grunt -> npm run grunt
    return 'npm run ' + command
  } else {
    return 'npm ' + command + "\n# couldn't auto-convert command"
  }
}
