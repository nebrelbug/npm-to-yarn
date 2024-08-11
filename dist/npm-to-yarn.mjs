import { codeToHtml } from 'shiki';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

var unchangedCLICommands = [
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
];
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
    'upgrade',
    'upgrade-interactive',
    'version',
    'versions',
    'why',
    'workspace',
    'workspaces'
];

function parse(command) {
    var args = [];
    var lastQuote = false;
    var escaped = false;
    var part = '';
    for (var i = 0; i < command.length; ++i) {
        var char = command.charAt(i);
        if (char === '\\') {
            part += char;
            escaped = true;
        }
        else {
            if (char === ' ' && !lastQuote) {
                args.push(part);
                part = '';
            }
            else if (!escaped && (char === '"' || char === "'")) {
                part += char;
                if (char === lastQuote) {
                    lastQuote = false;
                }
                else if (!lastQuote) {
                    lastQuote = char;
                }
            }
            else {
                part += char;
            }
            escaped = false;
        }
    }
    args.push(part);
    return args;
}

function convertAddRemoveArgs(args) {
    return args.map(function (item) {
        switch (item) {
            case '--no-lockfile':
                return '--no-package-lock';
            case '--production':
                return '--save-prod';
            case '--dev':
                return '--save-dev';
            case '--optional':
                return '--save-optional';
            case '--exact':
                return '--save-exact';
            default:
                return item;
        }
    });
}
var yarnToNpmTable = {
    add: function (args) {
        if (args.length === 2 && args[1] === '--force') {
            return ['rebuild'];
        }
        args[0] = 'install';
        return convertAddRemoveArgs(args);
    },
    remove: function (args) {
        args[0] = 'uninstall';
        return convertAddRemoveArgs(args);
    },
    version: function (args) {
        return args.map(function (item) {
            switch (item) {
                case '--major':
                    return 'major';
                case '--minor':
                    return 'minor';
                case '--patch':
                    return 'patch';
                default:
                    return item;
            }
        });
    },
    install: 'install',
    list: function (args) {
        args[0] = 'ls';
        var patternIndex = args.findIndex(function (item) { return item === '--pattern'; });
        if (patternIndex >= 0 && args[patternIndex + 1]) {
            var packages = args[patternIndex + 1].replace(/["']([^"']+)["']/, '$1').split('|');
            args.splice(patternIndex, 2, packages.join(' '));
        }
        return args;
    },
    init: 'init',
    create: 'init',
    outdated: 'outdated',
    run: 'run',
    global: function (args) {
        switch (args[1]) {
            case 'add':
                args.shift();
                args = yarnToNpmTable.add(args);
                args.push('--global');
                return args;
            case 'remove':
                args.shift();
                args = yarnToNpmTable.remove(args);
                args.push('--global');
                return args;
            case 'list':
                args.shift();
                args = yarnToNpmTable.list(args);
                args.push('--global');
                return args;
            // case 'bin':
            // case 'upgrade':
            default:
                args.push("\n# couldn't auto-convert command");
                return args;
        }
    },
    pack: function (args) {
        return args.map(function (item) {
            if (item === '--filename') {
                return '--pack-destination';
            }
            return item;
        });
    }
};
function yarnToNPM(_m, command) {
    command = (command || '').trim();
    if (command === '') {
        return 'npm install';
    }
    var args = parse(command);
    var firstCommand = (/\w+/.exec(command) || [''])[0];
    if (unchangedCLICommands.includes(args[0])) {
        return 'npm ' + command;
    }
    else if (args[0] in yarnToNpmTable) {
        var converter = yarnToNpmTable[args[0]];
        if (typeof converter === 'function') {
            args = converter(args);
        }
        else {
            args[0] = converter;
        }
        return 'npm ' + args.filter(Boolean).join(' ');
    }
    else if (!yarnCLICommands.includes(firstCommand)) {
        // i.e., yarn grunt -> npm run grunt
        return 'npm run ' + command;
    }
    else {
        return 'npm ' + command + "\n# couldn't auto-convert command";
    }
}

function convertInstallArgs$1(args) {
    if (args.includes('--global') || args.includes('-g')) {
        args.unshift('global');
    }
    return args.map(function (item) {
        switch (item) {
            case '--save-dev':
            case '-D':
                return '--dev';
            case '--save-prod':
            case '-P':
                return '--production';
            case '--no-package-lock':
                return '--no-lockfile';
            case '--save-optional':
            case '-O':
                return '--optional';
            case '--save-exact':
            case '-E':
                return '--exact';
            case '--save':
            case '-S':
            case '--global':
            case '-g':
                return '';
            default:
                return item;
        }
    });
}
var npmToYarnTable = {
    install: function (args) {
        if (args.length === 1) {
            return ['install'];
        }
        args[0] = 'add';
        return convertInstallArgs$1(args);
    },
    i: function (args) {
        return npmToYarnTable.install(args);
    },
    uninstall: function (args) {
        args[0] = 'remove';
        return convertInstallArgs$1(args);
    },
    un: function (args) {
        return npmToYarnTable.uninstall(args);
    },
    remove: function (args) {
        return npmToYarnTable.uninstall(args);
    },
    r: function (args) {
        return npmToYarnTable.uninstall(args);
    },
    rm: function (args) {
        return npmToYarnTable.uninstall(args);
    },
    version: function (args) {
        return args.map(function (item) {
            switch (item) {
                case 'major':
                    return '--major';
                case 'minor':
                    return '--minor';
                case 'patch':
                    return '--patch';
                default:
                    return item;
            }
        });
    },
    rb: function (args) {
        return npmToYarnTable.rebuild(args);
    },
    rebuild: function (args) {
        args[0] = 'add';
        args.push('--force');
        return args;
    },
    run: function (args) {
        if (args[1] && !unchangedCLICommands.includes(args[1]) && !yarnCLICommands.includes(args[1])) {
            args.splice(0, 1);
        }
        return args;
    },
    exec: function (args) {
        args[0] = 'run';
        return npmToYarnTable.run(args);
    },
    ls: function (args) {
        args[0] = 'list';
        var ended = false;
        var packages = args.filter(function (item, id) {
            if (id > 0 && !ended) {
                ended = item.startsWith('-');
                return !ended;
            }
            return false;
        });
        if (packages.length > 0) {
            args.splice(1, packages.length, '--pattern', '"' + packages.join('|') + '"');
        }
        return args;
    },
    list: function (args) {
        return npmToYarnTable.ls(args);
    },
    init: function (args) {
        if (args[1] && !args[1].startsWith('-')) {
            args[0] = 'create';
        }
        return args.filter(function (item) { return item !== '--scope'; });
    },
    ln: 'link',
    t: 'test',
    tst: 'test',
    outdated: 'outdated',
    pack: function (args) {
        return args.map(function (item) {
            if (item.startsWith('--pack-destination')) {
                return item.replace(/^--pack-destination[\s=]/, '--filename ');
            }
            return item;
        });
    }
};
function npmToYarn(_m, command) {
    var args = parse((command || '').trim());
    var index = args.findIndex(function (a) { return a === '--'; });
    if (index >= 0) {
        args.splice(index, 1);
    }
    if (unchangedCLICommands.includes(args[0])) {
        return 'yarn ' + args.filter(Boolean).join(' ');
    }
    else if (args[0] in npmToYarnTable) {
        var converter = npmToYarnTable[args[0]];
        if (typeof converter === 'function') {
            args = converter(args);
        }
        else {
            args[0] = converter;
        }
        return 'yarn ' + args.filter(Boolean).join(' ');
    }
    else {
        return 'npm ' + command + "\n# couldn't auto-convert command";
    }
}

function convertPnpmInstallArgs(args) {
    return args.map(function (item) {
        switch (item) {
            case '--save':
            case '-S':
                return '';
            case '--no-package-lock':
                return '--frozen-lockfile';
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
                return item;
        }
    });
}
function convertFilterArg(args) {
    if (args.length > 1) {
        var filter = args.filter(function (item, index) { return index !== 0 && !item.startsWith('-'); });
        if (filter.length > 0) {
            args = args.filter(function (item, index) { return index === 0 || item.startsWith('-'); });
            args.push('--filter');
            args.push(filter.join(' '));
        }
    }
    return args;
}
var npmToPnpmTable = {
    // ------------------------------
    install: function (args) {
        if (args.length > 1 && args.filter(function (item) { return !item.startsWith('-'); }).length > 1) {
            args[0] = 'add';
        }
        return convertPnpmInstallArgs(args);
    },
    i: function (args) {
        return npmToPnpmTable.install(args);
    },
    // ------------------------------
    uninstall: function (args) {
        args[0] = 'remove';
        return convertPnpmInstallArgs(args);
    },
    un: function (args) {
        return npmToPnpmTable.uninstall(args);
    },
    remove: function (args) {
        return npmToPnpmTable.uninstall(args);
    },
    r: function (args) {
        return npmToPnpmTable.uninstall(args);
    },
    rm: function (args) {
        return npmToPnpmTable.uninstall(args);
    },
    // ------------------------------
    rb: function (args) {
        return npmToPnpmTable.rebuild(args);
    },
    rebuild: function (args) {
        args[0] = 'rebuild';
        return convertFilterArg(args);
    },
    run: 'run',
    exec: 'exec',
    ls: function (args) {
        return npmToPnpmTable.list(args);
    },
    list: function (args) {
        return args.map(function (item) {
            if (item.startsWith('--depth=')) {
                return "--depth ".concat(item.split('=')[1]);
            }
            switch (item) {
                case '--production':
                    return '--prod';
                case '--development':
                    return '--dev';
                default:
                    return item;
            }
        });
    },
    init: function (args) {
        if (args[1] && !args[1].startsWith('-')) {
            args[0] = 'create';
        }
        return args.filter(function (item) { return item !== '--scope'; });
    },
    ln: 'link',
    t: 'test',
    test: 'test',
    tst: 'test',
    start: 'start',
    link: 'link',
    unlink: function (args) {
        return convertFilterArg(args);
    },
    outdated: 'outdated',
    pack: function (args) {
        return args.map(function (item) {
            if (item.startsWith('--pack-destination')) {
                return item.replace(/^--pack-destination[\s=]/, '--pack-destination ');
            }
            return item;
        });
    }
};
function npmToPnpm(_m, command) {
    var args = parse((command || '').trim());
    var index = args.findIndex(function (a) { return a === '--'; });
    if (index >= 0) {
        args.splice(index, 1);
    }
    if (args[0] in npmToPnpmTable) {
        var converter = npmToPnpmTable[args[0]];
        if (typeof converter === 'function') {
            args = converter(args);
        }
        else {
            args[0] = converter;
        }
        return 'pnpm ' + args.filter(Boolean).join(' ');
    }
    else {
        return 'npm ' + command + "\n# couldn't auto-convert command";
    }
}

function convertInstallArgs(args) {
    // bun uses -g and --global flags
    // bun mostly conforms to Yarn's CLI
    return args.map(function (item) {
        switch (item) {
            case '--save-dev':
            case '--development':
            case '-D':
                return '--dev';
            case '--save-prod':
            case '-P':
                return '--production';
            case '--no-package-lock':
                return '--no-save';
            case '--save-optional':
            case '-O':
                return '--optional';
            case '--save-exact':
            case '-E':
                return '--exact';
            case '--save':
            case '-S':
                // this is default in bun
                return '';
            case '--global':
            case '-g':
                return '--global';
            default:
                return item;
        }
    });
}
function npmToBun(_m, command) {
    var args = parse((command || '').trim());
    var index = args.findIndex(function (a) { return a === '--'; });
    if (index >= 0) {
        args.splice(index, 1);
    }
    var cmd = 'bun';
    switch (args[0]) {
        case 'install':
        case 'i':
            if (args.length === 1) {
                args = ['install'];
            }
            else {
                args[0] = 'add';
            }
            args = convertInstallArgs(args);
            break;
        case 'uninstall':
        case 'un':
        case 'remove':
        case 'r':
        case 'rm':
            args[0] = 'remove';
            args = convertInstallArgs(args);
            break;
        case 'cache':
            if (args[1] === 'clean') {
                args = ['pm', 'cache', 'rm'].concat(args.slice(2));
            }
            else {
                cmd = 'npm';
            }
            break;
        case 'rebuild':
        case 'rb':
            args[0] = 'add';
            args.push('--force');
            break;
        case 'run':
            break;
        case 'list':
        case 'ls':
            // 'npm ls' => 'bun pm ls'
            args = convertInstallArgs(args);
            args[0] = 'ls';
            args.unshift('pm');
            break;
        case 'init':
        case 'create':
            if (args[1]) {
                if (args[1].startsWith('@')) {
                    cmd = 'bunx';
                    args[1] = args[1].replace('/', '/create-');
                    args = args.slice(1);
                }
                else if (!args[1].startsWith('-')) {
                    cmd = 'bunx';
                    args[1] = "create-".concat(args[1]);
                    args = args.slice(1);
                }
                else {
                    args[0] = 'init';
                }
            }
            break;
        case 'link':
        case 'ln':
            args = convertInstallArgs(args);
            args[0] = 'link';
            break;
        case 'stop':
        case 'start':
        case 'unlink':
            break;
        case 'test':
        case 't':
        case 'tst':
            args[0] = 'test';
            args.unshift('run');
            break;
        case 'exec':
            cmd = 'bunx';
            args.splice(0, 1);
            break;
        default:
            // null == keep `npm` command
            cmd = 'npm';
            break;
    }
    var filtered = args.filter(Boolean).filter(function (arg) { return arg !== '--'; });
    return "".concat(cmd, " ").concat(filtered.join(' ')).concat(cmd === 'npm' ? "\n# couldn't auto-convert command" : '').replace('=', ' ');
}

/**
 * Converts between npm and yarn command
 */
function convert(str, to) {
    if (to === 'npm') {
        return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM);
    }
    else if (to === 'pnpm') {
        return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToPnpm);
    }
    else if (to === 'bun') {
        return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToBun);
    }
    else {
        return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn);
    }
}
/**
 * Returns highlighted html string
 */
function highlight(command, theme) {
    if (theme === void 0) { theme = "light"; }
    return __awaiter(this, void 0, void 0, function () {
        var html, _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, codeToHtml(command, {
                        lang: 'javascript',
                        theme: "github-".concat(theme)
                    })];
                case 1:
                    html = _c.sent();
                    _b = (_a = console).log;
                    return [4 /*yield*/, html];
                case 2:
                    _b.apply(_a, [_c.sent()]);
                    return [2 /*return*/];
            }
        });
    });
}

export { convert, highlight };
//# sourceMappingURL=npm-to-yarn.mjs.map
