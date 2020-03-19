(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.n2y = factory());
}(this, (function () { 'use strict';

  var unchangedCLICommands = [
      'init',
      'run',
      'test',
      'login',
      'logout',
      'link',
      'publish',
      'cache'
  ];
  var yarnCLICommands = [
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
      'unlink',
      'upgrade',
      'upgrade-interactive',
      'version',
      'versions',
      'why',
      'workspace',
      'workspaces'
  ];

  var npmToYarnTable = {
      install: function (command) {
          if (/^install *$/.test(command)) {
              return 'install';
          }
          var ret = command
              .replace('install', 'add')
              .replace('--save-dev', '--dev')
              .replace(/\s*--save/, '')
              .replace('--no-package-lock', '--no-lockfile')
              .replace('--save-optional', '--optional')
              .replace('--save-exact', '--exact');
          if (/ --global| -g/.test(ret)) {
              ret = ret.replace(/\s*--global|-g/, '');
              ret = 'global ' + ret;
          }
          return ret;
      },
      uninstall: function (command) {
          var ret = command
              .replace('uninstall', 'remove')
              .replace('--save-dev', '--dev')
              .replace(/\s*--save/, '')
              .replace('--no-package-lock', '--no-lockfile');
          if (/ --global| -g/.test(ret)) {
              ret = ret.replace(/\s*--global|-g/, '');
              ret = 'global ' + ret;
          }
          return ret;
      },
      version: function (command) {
          return command.replace(/(major|minor|patch)/, '--$1');
      },
      rebuild: function (command) {
          return command.replace('rebuild', 'add --force');
      }
  };
  var yarnToNpmTable = {
      add: function (command, global) {
          var dev;
          if (command === 'add --force') {
              return 'rebuild';
          }
          var ret = command
              .replace('add', 'install')
              .replace(/\s*--dev/, function () {
              dev = true;
              return '';
          })
              .replace('--no-lockfile', '--no-package-lock')
              .replace('--optional', '--save-optional')
              .replace('--exact', '--save-exact');
          if (dev) {
              ret += ' --save-dev';
          }
          else if (global) {
              ret += ' --global';
          }
          else {
              ret += ' --save';
          }
          return ret;
      },
      remove: function (command, global) {
          var dev;
          var ret = command
              .replace('remove', 'uninstall')
              .replace(/\s*--dev/, function () {
              dev = true;
              return '';
          })
              .replace('--no-lockfile', '--no-package-lock')
              .replace('--optional', '--save-optional')
              .replace('--exact', '--save-exact');
          if (dev) {
              ret += ' --save-dev';
          }
          else if (global) {
              ret += ' --global';
          }
          else {
              ret += ' --save';
          }
          return ret;
      },
      version: function (command) {
          return command.replace(/--(major|minor|patch)/, '$1');
      },
      install: 'install'
  };
  yarnToNpmTable.global = function (command) {
      if (/^global add/.test(command)) {
          return yarnToNpmTable.add(command.replace(/^global add/, 'add'), true);
      }
      else if (/^global remove/.test(command)) {
          return yarnToNpmTable.remove(command.replace(/^global remove/, 'remove'), true);
      }
  };
  function convert(str, to) {
      var returnStr = str;
      if (to === 'npm') {
          return returnStr.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM);
      }
      else {
          return returnStr.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn);
      }
  }
  function npmToYarn(m, command) {
      command = (command || '').trim();
      var firstCommand = (/\w+/.exec(command) || [''])[0];
      if (unchangedCLICommands.includes(firstCommand)) {
          return 'yarn ' + command;
      }
      else if (Object.prototype.hasOwnProperty.call(npmToYarnTable, firstCommand) &&
          npmToYarnTable[firstCommand]) {
          if (typeof npmToYarnTable[firstCommand] === 'function') {
              return 'yarn ' + npmToYarnTable[firstCommand](command);
          }
          else {
              return 'yarn ' + command.replace(firstCommand, npmToYarnTable[firstCommand]);
          }
      }
      else {
          return 'yarn ' + command + "\n# couldn't auto-convert command";
      }
  }
  function yarnToNPM(m, command) {
      command = (command || '').trim();
      if (command === '') {
          return 'npm install';
      }
      var firstCommand = (/\w+/.exec(command) || [''])[0];
      if (unchangedCLICommands.includes(firstCommand)) {
          return 'npm ' + command;
      }
      else if (Object.prototype.hasOwnProperty.call(yarnToNpmTable, firstCommand) &&
          yarnToNpmTable[firstCommand]) {
          if (typeof yarnToNpmTable[firstCommand] === 'function') {
              return 'npm ' + yarnToNpmTable[firstCommand](command);
          }
          else {
              return 'npm ' + command.replace(firstCommand, yarnToNpmTable[firstCommand]);
          }
      }
      else if (!yarnCLICommands.includes(firstCommand)) {
          // i.e., yarn grunt -> npm run grunt
          return 'npm run ' + command;
      }
      else {
          return 'npm ' + command + "\n# couldn't auto-convert command";
      }
  }

  return convert;

})));
//# sourceMappingURL=npm-to-yarn.js.map
