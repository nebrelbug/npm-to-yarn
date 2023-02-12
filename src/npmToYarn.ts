import { unchangedCLICommands, yarnCLICommands } from './utils'

const npmToYarnTable = {
  install(command: string) {
    if (/^install *$/.test(command)) {
      return 'install'
    }
    let ret = command
      .replace('install', 'add')
      .replace('--save-dev', '--dev')
      .replace('--save-optional', '--optional')
      .replace('--save-exact', '--exact')
      .replace('--no-package-lock', '--no-lockfile')
      .replace(/\s*--save/, '')
    if (/ -(?:-global|g)(?![^\b])/.test(ret)) {
      ret = ret.replace(/ -(?:-global|g)(?![^\b])/, '')
      ret = 'global ' + ret
    }
    return ret
  },
  uninstall(command: string) {
    let ret = command
      .replace('uninstall', 'remove')
      .replace('--save-dev', '--dev')
      .replace(/\s*--save/, '')
      .replace('--no-package-lock', '--no-lockfile')
    if (/ -(?:-global|g)(?![^\b])/.test(ret)) {
      ret = ret.replace(/ -(?:-global|g)(?![^\b])/, '')
      ret = 'global ' + ret
    }
    return ret
  },
  version(command: string) {
    return command.replace(/(major|minor|patch)/, '--$1')
  },
  rebuild(command: string) {
    return command.replace('rebuild', 'add --force')
  },
  exec (command: string) {
    return command.replace(
      /^exec\s?([^\s]+)?(\s--\s--)?(.*)$/,
      (_, data?: string, dash?: string, rest?: string): string => {
        let result = ''
        if (data && !unchangedCLICommands.includes(data) && !yarnCLICommands.includes(data)) {
          result += data
        } else {
          result += 'run ' + (data || '')
        }
        if (dash) result += dash.replace(/^\s--/, '')
        if (rest) result += rest
        return result
      }
    )
  },
  run(command: string) {
    return command.replace(
      /^run\s?([^\s]+)?(\s--\s--)?(.*)$/,
      (_, data?: string, dash?: string, rest?: string): string => {
        let result = ''
        if (data && !unchangedCLICommands.includes(data) && !yarnCLICommands.includes(data)) {
          result += data
        } else {
          result += 'run ' + (data || '')
        }
        if (dash) result += dash.replace(/^\s--/, '')
        if (rest) result += rest
        return result
      }
    )
  },
  ls(command: string) {
    return command.replace(/^(ls|list)(.*)$/, function (_1, _2: string, args: string): string {
      let result = 'list'
      if (args) {
        let ended = false
        let packages = []
        const items = args.split(' ').filter(Boolean)
        for (const item of items) {
          if (ended) {
            result += ' ' + item
          } else if (item.startsWith('-')) {
            result += ' --pattern "' + packages.join('|') + '"'
            packages = []
            ended = true
            result += ' ' + item
          } else {
            packages.push(item)
          }
        }
        if (packages.length > 0) {
          result += ' --pattern "' + packages.join('|') + '"'
        }
        return result
      } else {
        return 'list'
      }
    })
  },
  list(command: string) {
    return npmToYarnTable.ls(command)
  },
  init(command: string) {
    if (/^init (?!-).*$/.test(command)) {
      return command.replace('init', 'create')
    }
    return command.replace(' --scope', '')
  },
  start: 'start',
  stop: 'stop',
  test: 'test',
}

export function npmToYarn(_m: string, command: string): string {
  command = (command || '').trim()
  const firstCommand = (/\w+/.exec(command) || [''])[0]

  if (unchangedCLICommands.includes(firstCommand)) {
    return 'yarn ' + command
  }

  if (firstCommand in npmToYarnTable) {
    const converter = npmToYarnTable[firstCommand as keyof typeof npmToYarnTable]

    if (typeof converter === 'function') {
      return 'yarn ' + converter(command)
    } else {
      return 'yarn ' + command.replace(firstCommand, converter)
    }
  } else {
    return 'yarn ' + command + "\n# couldn't auto-convert command"
  }
}
