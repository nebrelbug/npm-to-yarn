(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.n2y = {}));
})(this, (function (exports) { 'use strict';

  var unchangedCLICommands = ['test', 'login', 'logout', 'link', 'publish', 'cache'];
  var yarnCLICommands = [
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
      'link',
      'unlink',
      'upgrade',
      'upgrade-interactive',
      'version',
      'versions',
      'why',
      'workspace',
      'workspaces',
  ];

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
      install: 'install',
      list: function (command) {
          return command
              .replace(/--pattern ["']([^"']+)["']/, function (_, packages) {
              return packages.split('|').join(' ');
          })
              .replace(/^list/, 'ls');
      },
      init: 'init',
      create: 'init',
      run: 'run',
      start: 'start',
      stop: 'stop',
      test: 'test',
      global: function (command) {
          if (/^global add/.test(command)) {
              return yarnToNpmTable.add(command.replace(/^global add/, 'add'), true);
          }
          else if (/^global remove/.test(command)) {
              return yarnToNpmTable.remove(command.replace(/^global remove/, 'remove'), true);
          }
          return 'npm ' + command + "\n# couldn't auto-convert command";
      },
  };
  function yarnToNPM(_m, command) {
      command = (command || '').trim();
      if (command === '') {
          return 'npm install';
      }
      var firstCommand = (/\w+/.exec(command) || [''])[0];
      if (unchangedCLICommands.includes(firstCommand)) {
          return 'npm ' + command;
      }
      if (firstCommand in yarnToNpmTable) {
          var converter = yarnToNpmTable[firstCommand];
          if (typeof converter === 'function') {
              return 'npm ' + converter(command);
          }
          else {
              return 'npm ' + command.replace(firstCommand, converter);
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

  var npmToYarnTable = {
      install: function (command) {
          if (/^install *$/.test(command)) {
              return 'install';
          }
          var ret = command
              .replace('install', 'add')
              .replace('--save-dev', '--dev')
              .replace('--no-package-lock', '--no-lockfile')
              .replace('--save-optional', '--optional')
              .replace('--save-exact', '--exact')
              .replace(/\s*--save/, '');
          if (/ -(?:-global|g)(?![^\b])/.test(ret)) {
              ret = ret.replace(/ -(?:-global|g)(?![^\b])/, '');
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
          if (/ -(?:-global|g)(?![^\b])/.test(ret)) {
              ret = ret.replace(/ -(?:-global|g)(?![^\b])/, '');
              ret = 'global ' + ret;
          }
          return ret;
      },
      version: function (command) {
          return command.replace(/(major|minor|patch)/, '--$1');
      },
      rebuild: function (command) {
          return command.replace('rebuild', 'add --force');
      },
      exec: function (command) {
          return command.replace(/^exec\s?([^\s]+)?(\s--\s--)?(.*)$/, function (_, data, dash, rest) {
              var result = '';
              if (data && !unchangedCLICommands.includes(data) && !yarnCLICommands.includes(data)) {
                  result += data;
              }
              else {
                  result += 'run ' + (data || '');
              }
              if (dash)
                  result += dash.replace(/^\s--/, '');
              if (rest)
                  result += rest;
              return result;
          });
      },
      run: function (command) {
          return command.replace(/^run\s?([^\s]+)?(\s--\s--)?(.*)$/, function (_, data, dash, rest) {
              var result = '';
              if (data && !unchangedCLICommands.includes(data) && !yarnCLICommands.includes(data)) {
                  result += data;
              }
              else {
                  result += 'run ' + (data || '');
              }
              if (dash)
                  result += dash.replace(/^\s--/, '');
              if (rest)
                  result += rest;
              return result;
          });
      },
      ls: function (command) {
          return command.replace(/^(ls|list)(.*)$/, function (_1, _2, args) {
              var result = 'list';
              if (args) {
                  var ended = false;
                  var packages = [];
                  var items = args.split(' ').filter(Boolean);
                  for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
                      var item = items_1[_i];
                      if (ended) {
                          result += ' ' + item;
                      }
                      else if (item.startsWith('-')) {
                          result += ' --pattern "' + packages.join('|') + '"';
                          packages = [];
                          ended = true;
                          result += ' ' + item;
                      }
                      else {
                          packages.push(item);
                      }
                  }
                  if (packages.length > 0) {
                      result += ' --pattern "' + packages.join('|') + '"';
                  }
                  return result;
              }
              else {
                  return 'list';
              }
          });
      },
      list: function (command) {
          return npmToYarnTable.ls(command);
      },
      init: function (command) {
          if (/^init (?!-).*$/.test(command)) {
              return command.replace('init', 'create');
          }
          return command.replace(' --scope', '');
      },
      start: 'start',
      stop: 'stop',
      test: 'test',
  };
  function npmToYarn(_m, command) {
      command = (command || '').trim();
      var firstCommand = (/\w+/.exec(command) || [''])[0];
      if (unchangedCLICommands.includes(firstCommand)) {
          return 'yarn ' + command;
      }
      if (firstCommand in npmToYarnTable) {
          var converter = npmToYarnTable[firstCommand];
          if (typeof converter === 'function') {
              return 'yarn ' + converter(command);
          }
          else {
              return 'yarn ' + command.replace(firstCommand, converter);
          }
      }
      else {
          return 'yarn ' + command + "\n# couldn't auto-convert command";
      }
  }

  /**
   * Converts yarn to npm command
   */
  function convertToNpm(str) {
      return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM);
  }
  /**
   * Converts npm to yarn command
   */
  function convertToYarn(str) {
      return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn);
  }
  /**
   * Converts between npm and yarn command
   */
  function convert(str, to) {
      if (to === 'npm') {
          return convertToNpm(str);
      }
      else {
          return convertToYarn(str);
      }
  }

  exports.convertToNpm = convertToNpm;
  exports.convertToYarn = convertToYarn;
  exports.default = convert;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=npm-to-yarn.umd.js.map
