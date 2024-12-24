import { parse } from './command'

function convertPnpmInstallArgs (args: string[]) {
  return args.map(item => {
    switch (item) {
      case '--save':
      case '-S':
        return ''
      case '--no-package-lock':
        return '--frozen-lockfile'
      // case '--save-dev':
      // case '-D':
      // case '--save-prod':
      // case '-P':
      // case '--save-optional':
      // case '-O':
      // case '--save-exact':
      // case '-E':
      // case '--global':
      // case '-g':
      default:
        return item
    }
  })
}

function convertFilterArg (args: string[]) {
  if (args.length > 1) {
    const filter = args.filter((item, index) => index !== 0 && !item.startsWith('-'))
    if (filter.length > 0) {
      args = args.filter((item, index) => index === 0 || item.startsWith('-'))
      args.push('--filter')
      args.push(filter.join(' '))
    }
  }

  return args
}

const npmToPnpmTable = {
  // ------------------------------
  install (args: string[]) {
    if (args.length > 1 && args.filter(item => !item.startsWith('-')).length > 1) {
      args[0] = 'add'
    }
    return convertPnpmInstallArgs(args)
  },
  i (args: string[]) {
    return npmToPnpmTable.install(args)
  },
  // ------------------------------
  uninstall (args: string[]) {
    args[0] = 'remove'

    return convertPnpmInstallArgs(args)
  },
  un (args: string[]) {
    return npmToPnpmTable.uninstall(args)
  },
  remove (args: string[]) {
    return npmToPnpmTable.uninstall(args)
  },
  r (args: string[]) {
    return npmToPnpmTable.uninstall(args)
  },
  rm (args: string[]) {
    return npmToPnpmTable.uninstall(args)
  },
  // ------------------------------
  rb (args: string[]) {
    return npmToPnpmTable.rebuild(args)
  },
  rebuild (args: string[]) {
    args[0] = 'rebuild'
    return convertFilterArg(args)
  },
  run: 'run',
  exec: 'exec',
  ls (args: string[]) {
    return npmToPnpmTable.list(args)
  },
  list (args: string[]) {
    return args.map(item => {
      if (item.startsWith('--depth=')) {
        return `--depth ${item.split('=')[1]}`
      }
      switch (item) {
        case '--production':
          return '--prod'
        case '--development':
          return '--dev'
        default:
          return item
      }
    })
  },
  init (args: string[]) {
    if (args[1] && !args[1].startsWith('-')) {
      args[0] = 'create'
      const m = args[1].match(/(.+)@latest/)
      if (m) {
        args[1] = m[1]
      }
    }
    return args.filter(item => item !== '--scope')
  },
  create (args: string[]) {
    return npmToPnpmTable.init(args)
  },
  ln: 'link',
  t: 'test',
  test: 'test',
  tst: 'test',
  start: 'start',
  link: 'link',
  unlink (args: string[]) {
    return convertFilterArg(args)
  },
  outdated: 'outdated',
  pack: (args: string[]) => {
    return args.map(item => {
      if (item.startsWith('--pack-destination')) {
        return item.replace(/^--pack-destination[\s=]/, '--pack-destination ')
      }
      return item
    })
  }
}

export function npmToPnpm (_m: string, command: string): string {
  let args = parse((command || '').trim())

  const index = args.findIndex(a => a === '--')
  if (index >= 0) {
    args.splice(index, 1)
  }

  if (args[0] in npmToPnpmTable) {
    const converter = npmToPnpmTable[args[0] as keyof typeof npmToPnpmTable]

    if (typeof converter === 'function') {
      args = converter(args)
    } else {
      args[0] = converter
    }

    return 'pnpm ' + args.filter(Boolean).join(' ')
  } else {
    return 'npm ' + command + "\n# couldn't auto-convert command"
  }
}
