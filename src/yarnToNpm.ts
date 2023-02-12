import { unchangedCLICommands, yarnCLICommands } from './utils'
import { parse } from './command'

function convertAddRemoveArgs(args: string[]) {
  return args.map((item) => {
    switch (item) {
      case '--no-lockfile':
        return '--no-package-lock'
      case '--dev':
        return '--save-dev'
      case '--optional':
        return '--save-optional'
      case '--exact':
        return '--save-exact'
      default:
        return item
    }
  })
}

const yarnToNpmTable = {
  add(args: string[]) {
    if (args[1] === '--force') {
      return ['rebuild']
    }
    args[0] = 'install'
    if (!args.includes('--dev') && !args.includes('--exact') && !args.includes('--optional')) {
      args.push('--save')
    }
    return convertAddRemoveArgs(args)
  },
  remove(args: string[]) {
    args[0] = 'uninstall'
    if (!args.includes('--dev')) {
      args.push('--save')
    }
    return convertAddRemoveArgs(args)
  },
  version(args: string[]) {
    return args.map((item) => {
      switch (item) {
        case '--major':
          return 'major'
        case '--minor':
          return 'minor'
        case '--patch':
          return 'patch'
        default:
          return item
      }
    })
  },
  install: 'install',
  list(args: string[]) {
    args[0] = 'ls'
    const patternIndex = args.findIndex((item) => item === '--pattern')
    if (patternIndex && args[patternIndex + 1]) {
      const packages = args[patternIndex + 1].replace(/["']([^"']+)["']/, '$1').split('|')
      args.splice(patternIndex, 2, packages.join(' '))
    }
    return args
  },
  init: 'init',
  create: 'init',
  run: 'run',
  start: 'start',
  stop: 'stop',
  test: 'test',
  global(args: string[]) {
    if (args[1] === 'add' || args[1] === 'remove') {
      args.splice(0, 2, args[1] === 'add' ? 'install' : 'uninstall')
      args.push('--global')
      return convertAddRemoveArgs(args)
    }
    // TODO: find better way
    args.push("\n# couldn't auto-convert command")
    return args
  },
}

export function yarnToNPM(_m: string, command: string): string {
  command = (command || '').trim()
  if (command === '') {
    return 'npm install'
  }
  let args = parse(command)
  const firstCommand = (/\w+/.exec(command) || [''])[0]

  if (unchangedCLICommands.includes(args[0])) {
    return 'npm ' + command
  } else if (args[0] in yarnToNpmTable) {
    const converter = yarnToNpmTable[args[0] as keyof typeof yarnToNpmTable]

    if (typeof converter === 'function') {
      args = converter(args)
    } else {
      args[0] = converter
    }

    return 'npm ' + args.filter(Boolean).join(' ')
  } else if (!yarnCLICommands.includes(firstCommand)) {
    // i.e., yarn grunt -> npm run grunt
    return 'npm run ' + command
  } else {
    return 'npm ' + command + "\n# couldn't auto-convert command"
  }
}
