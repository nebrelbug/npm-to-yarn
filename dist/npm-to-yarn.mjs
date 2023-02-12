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
        if (args[1] === '--force') {
            return ['rebuild'];
        }
        args[0] = 'install';
        if (!args.includes('--dev') && !args.includes('--exact') && !args.includes('--optional')) {
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
    start: 'start',
    stop: 'stop',
    test: 'test',
    global: function (args) {
        if (args[1] === 'add' || args[1] === 'remove') {
            args.splice(0, 2, args[1] === 'add' ? 'install' : 'uninstall');
            args.push('--global');
            return convertAddRemoveArgs(args);
        }
        // TODO: find better way
        args.push("\n# couldn't auto-convert command");
        return args;
    },
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

var npmToYarnTable = {
    install: function (args) {
        if (args.length === 1) {
            return args;
        }
        args[0] = 'add';
        if (args.includes('--global') || args.includes('-g')) {
            args.unshift('global');
        }
        return args.map(function (item) {
            if (item === '--save-dev' || item === '-D')
                return '--dev';
            else if (item === '--save' || item === '-S')
                return '';
            else if (item === '--no-package-lock')
                return '--no-lockfile';
            else if (item === '--save-optional')
                return '--optional';
            else if (item === '--save-exact' || item === '-E')
                return '--exact';
            else if (item === '--global' || item === '-g')
                return '';
            return item;
        });
    },
    i: function (args) {
        args[0] = 'install';
        return npmToYarnTable.install(args);
    },
    uninstall: function (args) {
        args[0] = 'remove';
        if (args.includes('--global') || args.includes('-g')) {
            args.unshift('global');
        }
        return args.map(function (item) {
            if (item === '--save-dev')
                return '--dev';
            else if (item === '--save')
                return '';
            else if (item === '--no-package-lock')
                return '--no-lockfile';
            else if (item === '--global' || item === '-g')
                return '';
            return item;
        });
    },
    version: function (args) {
        return args.map(function (item) {
            if (['major', 'minor', 'patch'].includes(item))
                return "--".concat(item);
            return item;
        });
    },
    rebuild: function (args) {
        args[0] = 'add --force';
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
    start: 'start',
    stop: 'stop',
    test: 'test',
};
function npmToYarn(_m, command) {
    var args = parse((command || '').trim());
    var index = args.findIndex(function (a) { return a === '--'; });
    if (index >= 0) {
        args.splice(index, 1);
    }
    if (unchangedCLICommands.includes(args[0])) {
        return 'yarn ' + args.join(' ');
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
        return 'yarn ' + command + "\n# couldn't auto-convert command";
    }
}

/**
 * Converts between npm and yarn command
 */
function convert(str, to) {
    if (to === 'npm') {
        return str.replace(/yarn(?: +([^&\n\r]*))?/gm, yarnToNPM);
    }
    else {
        return str.replace(/npm(?: +([^&\n\r]*))?/gm, npmToYarn);
    }
}

export { convert as default };
//# sourceMappingURL=npm-to-yarn.mjs.map
