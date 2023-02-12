import { unchangedCLICommands, yarnCLICommands } from './utils'
import { parse } from './command'

const npmToYarnTable = {
  install(args: string[]) {
    if (args.length === 1) {
      return args
    }
    args[0] = 'add'

    if (args.includes('--global') || args.includes('-g')) {
      args.unshift('global')
    }

    return args.map((item) => {
      if (item === '--save-dev') return '--dev'
      else if (item === '--save') return ''
      else if (item === '--no-package-lock') return '--no-lockfile'
      else if (item === '--save-optional') return '--optional'
      else if (item === '--save-exact') return '--exact'
      else if (item === '--global' || item === '-g') return ''
      return item
    })
  },
  i(args: string[]) {
    return npmToYarnTable.install(args)
  },
  uninstall(args: string[]) {
    args[0] = 'remove'

    if (args.includes('--global') || args.includes('-g')) {
      args.unshift('global')
    }

    return args.map((item) => {
      if (item === '--save-dev') return '--dev'
      else if (item === '--save') return ''
      else if (item === '--no-package-lock') return '--no-lockfile'
      else if (item === '--global' || item === '-g') return ''
      return item
    })
  },
  version(args: string[]) {
    return args.map((item) => {
      if (['major', 'minor', 'patch'].includes(item)) return `--${item}`
      return item
    })
  },
  rebuild(args: string[]) {
    args[0] = 'add --force'
    return args
  },
  run(args: string[]) {
    if (args[1] && !unchangedCLICommands.includes(args[1]) && !yarnCLICommands.includes(args[1])) {
      args.splice(0, 1)
    }
    const index = args.findIndex((a) => a === '--')
    if (index >= 0) {
      args.splice(index, 1)
    }
    return args
  },
  exec(args: string[]) {
    args[0] = 'run'
    return npmToYarnTable.run(args)
  },
  ls(args: string[]) {
    args[0] = 'list'

    let ended = false
    const packages = args.filter((item, id) => {
      if (id > 0 && !ended) {
        ended = item.startsWith('-')
        return !ended
      }
      return false
    })
    if (packages.length > 0) {
      args.splice(1, packages.length, '--pattern', '"' + packages.join('|') + '"')
    }
    return args
  },
  list(args: string[]) {
    return npmToYarnTable.ls(args)
  },
  init(args: string[]) {
    if (args[1] && !args[1].startsWith('-')) {
      args[0] = 'create'
    }
    return args.filter((item) => item !== '--scope')
  },
  start: 'start',
  stop: 'stop',
  test: 'test',
}

export function npmToYarn(_m: string, command: string): string {
  let args = parse((command || '').trim())

  if (unchangedCLICommands.includes(args[0])) {
    return 'yarn ' + command
  } else if (args[0] in npmToYarnTable) {
    const converter = npmToYarnTable[args[0] as keyof typeof npmToYarnTable]

    if (typeof converter === 'function') {
      args = converter(args)
    } else {
      args[0] = converter
    }

    return 'yarn ' + args.filter(Boolean).join(' ')
  } else {
    return 'yarn ' + command + "\n# couldn't auto-convert command"
  }
}
