import {
  unchangedCLICommands,
  yarnCLICommands,
  uniqueYarnCLICommands,
  npmCLICommands
} from './utils'

// keys are NPM, vals are Yarn

interface Indexable {
  [index: string]: string | Function
}

var npmToYarnTable: Indexable = {
  install: function(command: string) {
    console.log('command: ' + command)
    if (/^install *$/.test(command)) {
      return 'install'
    }
    var ret = command
      .replace('install', 'add')
      .replace('--save-dev', '--dev')
      .replace(/\s*--save/, '')
      .replace('--no-package-lock', '--no-lockfile')
      .replace('--save-optional', '--optional')
      .replace('--save-exact', '--exact')
    if (/--global|-g/.test(ret)) {
      ret = ret.replace(/--global|-g/, '')
      ret = 'global ' + ret
    }
    return ret
  },
  uninstall: function(command: string) {
    var ret = command
      .replace('uninstall', 'remove')
      .replace('--save-dev', '--dev')
      .replace(/\s*--save/, '')
      .replace('--no-package-lock', '--no-lockfile')
    if (/--global|-g/.test(ret)) {
      ret = ret.replace(/--global|-g/, '')
      ret = 'global ' + ret
    }
    return ret
  },
  version: function(command: string) {
    return command.replace(/(major|minor|patch)/, '--$1')
  },
  rebuild: function(command: string) {
    return command.replace('rebuild', 'add --force')
  }
}

var yarnToNpmTable: Indexable = {
  add: function(command: string, global?: true) {
    var dev
    if (command === 'add --force') {
      return 'rebuild'
    }
    var ret = command
      .replace('add', 'install')
      .replace(/\s*--dev/, function() {
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
  remove: function(command: string, global?: true) {
    var dev
    var ret = command
      .replace('remove', 'uninstall')
      .replace(/\s*--dev/, function() {
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
  version: function(command: string) {
    return command.replace(/--(major|minor|patch)/, '$1')
  },
  install: 'install '
}

yarnToNpmTable.global = function(command: string) {
  if (/^global add/.test(command)) {
    return (yarnToNpmTable.add as Function)(command.replace(/^global add/, 'add'), true)
  } else if (/^global remove/.test(command)) {
    return (yarnToNpmTable.remove as Function)(command.replace(/^global remove/, 'remove'), true)
  }
}

export default function convert(str: string, to: 'npm' | 'yarn'): string {
  var returnStr = str
  if (to === 'npm') {
    return returnStr.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM)
  } else {
    return returnStr.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn)
  }
}

function npmToYarn(m: string, command: string): string {
  console.log('npm2yarn called with ' + command)
  command = (command || '').trim()
  var firstCommand = (/\w+/.exec(command) || [''])[0]

  if (unchangedCLICommands.includes(firstCommand)) {
    return 'yarn ' + command
  } else if (npmToYarnTable.hasOwnProperty(firstCommand) && npmToYarnTable[firstCommand]) {
    if (typeof npmToYarnTable[firstCommand] === 'function') {
      return 'yarn ' + (npmToYarnTable[firstCommand] as Function)(command)
    } else {
      return 'yarn ' + command.replace(firstCommand, npmToYarnTable[firstCommand] as string)
    }
  } else {
    return 'yarn ' + command + "\n# couldn't auto-convert command"
  }
}

function yarnToNPM(m: string, command: string): string {
  command = (command || '').trim()
  if (command === '') {
    return 'npm install'
  }
  var firstCommand = (/\w+/.exec(command) || [''])[0]

  if (unchangedCLICommands.includes(firstCommand)) {
    return 'npm ' + command
  } else if (yarnToNpmTable.hasOwnProperty(firstCommand) && yarnToNpmTable[firstCommand]) {
    if (typeof yarnToNpmTable[firstCommand] === 'function') {
      return 'npm ' + (yarnToNpmTable[firstCommand] as Function)(command)
    } else {
      return 'npm ' + command.replace(firstCommand, yarnToNpmTable[firstCommand] as string)
    }
  } else if (!yarnCLICommands.hasOwnProperty(firstCommand)) {
    // i.e., yarn grunt -> npm run grunt
    return 'npm run ' + command
  } else {
    return 'npm ' + command + "\n# couldn't auto-convert command"
  }
}
