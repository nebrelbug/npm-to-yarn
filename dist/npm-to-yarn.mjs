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
        if (!args.includes('--dev') &&
            !args.includes('--force') &&
            !args.includes('--exact') &&
            !args.includes('--optional') &&
            !args.includes('--production')) {
            args.push('--save');
        }
        return convertAddRemoveArgs(args);
    },
    remove: function (args) {
        args[0] = 'uninstall';
        if (!args.includes('--dev')) {
            args.push('--save');
        }
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

function convertInstallArgs(args) {
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
        return convertInstallArgs(args);
    },
    i: function (args) {
        return npmToYarnTable.install(args);
    },
    uninstall: function (args) {
        args[0] = 'remove';
        return convertInstallArgs(args);
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
    else {
        return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn);
    }
}

export { convert as default };
//# sourceMappingURL=npm-to-yarn.mjs.map
