import {
  unchangedCLICommands,
  yarnCLICommands,
  uniqueYarnCLICommands,
  npmCLICommands
} from './utils'

// keys are NPM, vals are Yarn

interface Indexable {
  [index: string]: string | ((command: string) => string)
}

var npmToYarnTable: Indexable = {
  install: function (command: string) {
    if (/^install *$/.test(command)) {
      return 'install'
    }
    var ret = command
      .replace('install', 'add')
      .replace('--save-dev', '--dev')
      .replace('--save-exact', '--exact')
      .replace('--save-optional', '--optional')
      .replace(/\s*--save/, '')
      .replace('--no-package-lock', '--no-lockfile')
    if (/ -(?:-global|g)(?![^\b])/.test(ret)) {
      ret = ret.replace(/ -(?:-global|g)(?![^\b])/, '')
      ret = 'global ' + ret
    }
    return ret
  },
  uninstall: function (command: string) {
    var ret = command
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
  version: function (command: string) {
    return command.replace(/(major|minor|patch)/, '--$1')
  },
  rebuild: function (command: string) {
    return command.replace('rebuild', 'add --force')
  },
  run: function (command: string) {
    return command.replace(
      /^run\s?([^\s]+)?(\s--\s--)?(.*)$/,
      (_, data?: string, dash?: string, rest?: string): string => {
        var result = ''
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
  ls: function (command: string) {
    return command.replace(/^(ls|list)(.*)$/, function (_1, _2: string, args: string): string {
      var result = 'list'
      if (args) {
        var ended = false
        var packages = []
        var items = args.split(' ').filter(Boolean)
        for (var item of items) {
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
  list: function (command: string) {
    return (npmToYarnTable.ls as Function)(command)
  },
  init: function (command: string) {
    if (/^init (?!-).*$/.test(command)) {
      return command.replace('init', 'create')
    }
    return command.replace(' --scope', '')
  }
}

var yarnToNpmTable: Indexable = {
  add: function (command: string, global?: true) {
    var dev
    if (command === 'add --force') {
      return 'rebuild'
    }
    var ret = command
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
  remove: function (command: string, global?: true) {
    var dev
    var ret = command
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
  version: function (command: string) {
    return command.replace(/--(major|minor|patch)/, '$1')
  },
  install: 'install',
  list: function (command: string) {
    return command
      .replace(/--pattern ["']([^"']+)["']/, function (_, packages: string) {
        return packages.split('|').join(' ')
      })
      .replace(/^list/, 'ls')
  },
  init: 'init',
  create: 'init',
  run: 'run',
  global: function (command: string) {
    if (/^global add/.test(command)) {
      return (yarnToNpmTable.add as Function)(command.replace(/^global add/, 'add'), true)
    } else if (/^global remove/.test(command)) {
      return (yarnToNpmTable.remove as Function)(command.replace(/^global remove/, 'remove'), true)
    }
  }
}

export default function convert (str: string, to: 'npm' | 'yarn'): string {
  var returnStr = str
  if (to === 'npm') {
    return returnStr.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM)
  } else {
    return returnStr.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn)
  }
}

function npmToYarn (m: string, command: string): string {
  command = (command || '').trim()
  var firstCommand = (/\w+/.exec(command) || [''])[0]

  if (unchangedCLICommands.includes(firstCommand)) {
    return 'yarn ' + command
  } else if (
    Object.prototype.hasOwnProperty.call(npmToYarnTable, firstCommand) &&
    npmToYarnTable[firstCommand]
  ) {
    if (typeof npmToYarnTable[firstCommand] === 'function') {
      return 'yarn ' + (npmToYarnTable[firstCommand] as Function)(command)
    } else {
      return 'yarn ' + command.replace(firstCommand, npmToYarnTable[firstCommand] as string)
    }
  } else {
    return 'yarn ' + command + "\n# couldn't auto-convert command"
  }
}

function yarnToNPM (m: string, command: string): string {
  command = (command || '').trim()
  if (command === '') {
    return 'npm install'
  }
  var firstCommand = (/\w+/.exec(command) || [''])[0]

  if (unchangedCLICommands.includes(firstCommand)) {
    return 'npm ' + command
  } else if (
    Object.prototype.hasOwnProperty.call(yarnToNpmTable, firstCommand) &&
    yarnToNpmTable[firstCommand]
  ) {
    if (typeof yarnToNpmTable[firstCommand] === 'function') {
      return 'npm ' + (yarnToNpmTable[firstCommand] as Function)(command)
    } else {
      return 'npm ' + command.replace(firstCommand, yarnToNpmTable[firstCommand] as string)
    }
  } else if (!yarnCLICommands.includes(firstCommand)) {
    // i.e., yarn grunt -> npm run grunt
    return 'npm run ' + command
  } else {
    return 'npm ' + command + "\n# couldn't auto-convert command"
  }
}
