/* global it, expect, describe */

import convert from '../src'

describe('NPM tests', () => {
  const tests = [
    // install
    ['npm install', 'yarn install', 'pnpm install'],
    ['npm i', 'yarn install', 'pnpm i'],
    ['npm i squirrelly', 'yarn add squirrelly', 'pnpm add squirrelly'],
    ['npm install squirrelly', 'yarn add squirrelly', 'pnpm add squirrelly'],
    ['npm install my--save-dev', 'yarn add my--save-dev', 'pnpm add my--save-dev'],
    [
      'npm install squirrelly --no-package-lock',
      'yarn add squirrelly --no-lockfile',
      'pnpm add squirrelly --frozen-lockfile'
    ],
    [
      'npm install squirrelly --save-optional',
      'yarn add squirrelly --optional',
      'pnpm add squirrelly --save-optional'
    ],
    ['npm install squirrelly -O', 'yarn add squirrelly --optional', 'pnpm add squirrelly -O'],
    [
      'npm install squirrelly --save-exact',
      'yarn add squirrelly --exact',
      'pnpm add squirrelly --save-exact'
    ],
    ['npm install squirrelly -E', 'yarn add squirrelly --exact', 'pnpm add squirrelly -E'],
    [
      'npm install squirrelly --save-dev',
      'yarn add squirrelly --dev',
      'pnpm add squirrelly --save-dev'
    ],
    ['npm install squirrelly -D', 'yarn add squirrelly --dev', 'pnpm add squirrelly -D'],
    [
      'npm install squirrelly --save-prod',
      'yarn add squirrelly --production',
      'pnpm add squirrelly --save-prod'
    ],
    ['npm install squirrelly -P', 'yarn add squirrelly --production', 'pnpm add squirrelly -P'],
    ['npm install squirrelly --save', 'yarn add squirrelly', 'pnpm add squirrelly'],
    ['npm install squirrelly -S', 'yarn add squirrelly', 'pnpm add squirrelly'],
    [
      'npm install squirrelly --global',
      'yarn global add squirrelly',
      'pnpm add squirrelly --global'
    ],
    ['npm install squirrelly -g', 'yarn global add squirrelly', 'pnpm add squirrelly -g'],
    [
      'npm install squirrelly --no-save',
      'yarn add squirrelly --no-save',
      'pnpm add squirrelly --no-save'
    ],
    // uninstall
    ['npm r squirrelly', 'yarn remove squirrelly', 'pnpm remove squirrelly'],
    ['npm remove squirrelly', 'yarn remove squirrelly', 'pnpm remove squirrelly'],
    ['npm uninstall squirrelly', 'yarn remove squirrelly', 'pnpm remove squirrelly'],
    ['npm un squirrelly', 'yarn remove squirrelly', 'pnpm remove squirrelly'],
    [
      'npm uninstall squirrelly --global',
      'yarn global remove squirrelly',
      'pnpm remove squirrelly --global'
    ],
    // cache
    ['npm cache clean', 'yarn cache clean', "npm cache clean\n# couldn't auto-convert command"],
    // version
    ['npm version', 'yarn version', "npm version\n# couldn't auto-convert command"],
    [
      'npm version major',
      'yarn version --major',
      "npm version major\n# couldn't auto-convert command"
    ],
    [
      'npm version minor',
      'yarn version --minor',
      "npm version minor\n# couldn't auto-convert command"
    ],
    [
      'npm version patch',
      'yarn version --patch',
      "npm version patch\n# couldn't auto-convert command"
    ],
    // rebuild
    ['npm rebuild', 'yarn add --force', 'pnpm rebuild'],
    ['npm rb', 'yarn add --force', 'pnpm rebuild'],
    ['npm rebuild package', 'yarn add package --force', 'pnpm rebuild --filter package'],
    ['npm rb package', 'yarn add package --force', 'pnpm rebuild --filter package'],
    // run
    ['npm run', 'yarn run', 'pnpm run'],
    ['npm run package', 'yarn package', 'pnpm run package'],
    ['npm run test -- --version', 'yarn run test --version', 'pnpm run test -- --version'],
    ['npm run test -- -v', 'yarn run test -v', 'pnpm run test -- -v'],
    ['npm run custom', 'yarn custom', 'pnpm run custom'],
    ['npm run add', 'yarn run add', 'pnpm run add'],
    ['npm run install', 'yarn run install', 'pnpm run install'],
    ['npm run run', 'yarn run run', 'pnpm run run'],
    ['npm exec custom', 'yarn custom', 'pnpm exec custom'],
    ['npm exec add', 'yarn run add', 'pnpm exec add'],
    ['npm exec install', 'yarn run install', 'pnpm exec install'],
    ['npm exec run', 'yarn run run', 'pnpm exec run'],
    ['npm exec custom -- --version', 'yarn custom --version', 'pnpm exec custom -- --version'],
    // test
    ['npm test', 'yarn test', 'pnpm test'],
    ['npm t', 'yarn test', 'pnpm test'],
    ['npm tst', 'yarn test', 'pnpm test'],
    ['npm test -- --version', 'yarn test --version', 'pnpm test -- --version'],
    ['npm test -- -v', 'yarn test -v', 'pnpm test -- -v'],
    // unchanged
    ['npm start', 'yarn start', 'pnpm start'],
    ['npm stop', 'yarn stop', "npm stop\n# couldn't auto-convert command"],
    // unsupported
    [
      'npm whoami',
      "npm whoami\n# couldn't auto-convert command",
      "npm whoami\n# couldn't auto-convert command"
    ],
    // init
    ['npm init', 'yarn init', 'pnpm init'],
    ['npm init -y', 'yarn init -y', 'pnpm init -y'],
    ['npm init --yes', 'yarn init --yes', 'pnpm init --yes'],
    ['npm init --scope', 'yarn init', 'pnpm init'],
    ['npm init --private', 'yarn init --private', 'pnpm init --private'],
    ['npm init --unknown-arg', 'yarn init --unknown-arg', 'pnpm init --unknown-arg'],
    ['npm init esm --yes', 'yarn create esm --yes', 'pnpm create esm --yes'],
    [
      'npm init @scope/my-package',
      'yarn create @scope/my-package',
      'pnpm create @scope/my-package'
    ],
    [
      'npm init react-app ./my-react-app',
      'yarn create react-app ./my-react-app',
      'pnpm create react-app ./my-react-app'
    ],
    // list
    ['npm list', 'yarn list', 'pnpm list'],
    ['npm ls', 'yarn list', 'pnpm ls'],
    ['npm list --production', 'yarn list --production', 'pnpm list --prod'],
    ['npm list --development', 'yarn list --development', 'pnpm list --dev'],
    ['npm list --global', 'yarn list --global', 'pnpm list --global'],
    ['npm list --depth=0', 'yarn list --depth=0', 'pnpm list --depth 0'],
    ['npm list package', 'yarn list --pattern "package"', 'pnpm list package'],
    [
      'npm list package package2',
      'yarn list --pattern "package|package2"',
      'pnpm list package package2'
    ],
    [
      'npm list @scope/package @scope/package2',
      'yarn list --pattern "@scope/package|@scope/package2"',
      'pnpm list @scope/package @scope/package2'
    ],
    [
      'npm list @scope/package @scope/package2 --depth=2',
      'yarn list --pattern "@scope/package|@scope/package2" --depth=2',
      'pnpm list @scope/package @scope/package2 --depth 2'
    ],
    [
      'npm list @scope/package @scope/package2 --depth 2',
      'yarn list --pattern "@scope/package|@scope/package2" --depth 2',
      'pnpm list @scope/package @scope/package2 --depth 2'
    ],
    [
      'npm list @scope/package --json',
      'yarn list --pattern "@scope/package" --json',
      'pnpm list @scope/package --json'
    ],
    // link
    ['npm ln', 'yarn link', 'pnpm link'],
    ['npm ln package', 'yarn link package', 'pnpm link package'],
    ['npm link', 'yarn link', 'pnpm link'],
    ['npm link package', 'yarn link package', 'pnpm link package'],
    // unlink
    ['npm unlink', 'yarn unlink', 'pnpm unlink'],
    ['npm unlink package', 'yarn unlink package', 'pnpm unlink --filter package'],
    // outdated
    ['npm outdated', 'yarn outdated', 'pnpm outdated'],
    ['npm outdated --json', 'yarn outdated --json', 'pnpm outdated --json'],
    ['npm outdated --long', 'yarn outdated --long', 'pnpm outdated --long'],
    ['npm outdated lodash', 'yarn outdated lodash', 'pnpm outdated lodash'],
    // pack
    ['npm pack', 'yarn pack', 'pnpm pack'],
    [
      'npm pack --pack-destination=foobar',
      'yarn pack --filename foobar',
      'pnpm pack --pack-destination foobar'
    ]
  ]

  describe('to Yarn', () => {
    it.each(tests)('%s', (npmValue, yarnValue) => {
      expect(convert(npmValue, 'yarn')).toEqual(yarnValue)
    })
  })

  describe('to PNPM', () => {
    it.each(tests)('%s', (npmValue, _yarnValue, pnpmValue) => {
      expect(convert(npmValue, 'pnpm')).toEqual(pnpmValue)
    })
  })
})

describe('Yarn to NPM tests', () => {
  it('Simple convert works', () => {
    expect(convert('yarn add squirrelly', 'npm')).toEqual('npm install squirrelly --save')
    expect(convert('yarn add squirrelly --no-lockfile', 'npm')).toEqual(
      'npm install squirrelly --no-package-lock --save'
    )
    expect(convert('yarn add squirrelly --optional', 'npm')).toEqual(
      'npm install squirrelly --save-optional'
    )
    expect(convert('yarn add squirrelly --exact', 'npm')).toEqual(
      'npm install squirrelly --save-exact'
    )
    expect(convert('yarn add test --production', 'npm')).toEqual('npm install test --save-prod')
  })

  it('Convert with dev works', () => {
    expect(convert('yarn add squirrelly --dev', 'npm')).toEqual('npm install squirrelly --save-dev')
  })

  it('Convert with remove works', () => {
    expect(convert('yarn remove squirrelly --dev', 'npm')).toEqual(
      'npm uninstall squirrelly --save-dev'
    )
  })

  it('Convert with cache clean works', () => {
    expect(convert('yarn cache clean', 'npm')).toEqual('npm cache clean')
  })

  it('Yarn implied run', () => {
    expect(convert('yarn grunt', 'npm')).toEqual('npm run grunt')
  })

  it('Plain yarn install', () => {
    expect(convert('yarn install', 'npm')).toEqual('npm install')
  })

  it('Yarn global', () => {
    expect(convert('yarn global add squirrelly', 'npm')).toEqual(
      'npm install squirrelly --save --global'
    )
    expect(convert('yarn global remove squirrelly', 'npm')).toEqual(
      'npm uninstall squirrelly --save --global'
    )
    expect(convert('yarn global squirrelly', 'npm')).toEqual(
      'npm global squirrelly \n' + "# couldn't auto-convert command"
    )
    expect(convert('yarn global list', 'npm')).toEqual('npm ls --global')
  })

  it('Plain `yarn`', () => {
    expect(convert('yarn', 'npm')).toEqual('npm install')
  })

  it('yarn add --force', () => {
    expect(convert('yarn add --force', 'npm')).toEqual('npm rebuild')
    expect(convert('yarn add package --force', 'npm')).toEqual('npm install package --force')
  })

  it('Version works', () => {
    expect(convert('yarn version', 'npm')).toEqual('npm version')
    expect(convert('yarn version --major', 'npm')).toEqual('npm version major')
    expect(convert('yarn version --minor', 'npm')).toEqual('npm version minor')
    expect(convert('yarn version --patch', 'npm')).toEqual('npm version patch')
  })

  it('Yarn remove', () => {
    expect(convert('yarn remove squirrelly', 'npm')).toEqual('npm uninstall squirrelly --save')
  })

  it("Yarn upgrade-interactive can't auto-convert", () => {
    expect(convert('yarn upgrade-interactive', 'npm')).toEqual(
      "npm upgrade-interactive\n# couldn't auto-convert command"
    )
  })

  it('yarn init', () => {
    expect(convert('yarn init', 'npm')).toEqual('npm init')
    expect(convert('yarn init -y', 'npm')).toEqual('npm init -y')
    expect(convert('yarn init --yes', 'npm')).toEqual('npm init --yes')
    expect(convert('yarn init --private', 'npm')).toEqual('npm init --private')
    expect(convert('yarn init --unknown-arg', 'npm')).toEqual('npm init --unknown-arg')
  })

  it('yarn create', () => {
    expect(convert('yarn create esm --yes', 'npm')).toEqual('npm init esm --yes')
    expect(convert('yarn create @scope/my-package', 'npm')).toEqual('npm init @scope/my-package')
    expect(convert('yarn create react-app ./my-react-app', 'npm')).toEqual(
      'npm init react-app ./my-react-app'
    )
  })

  it('npm custom', () => {
    expect(convert('yarn start', 'npm')).toEqual('npm start')
    expect(convert('yarn stop', 'npm')).toEqual('npm stop')
    expect(convert('yarn test', 'npm')).toEqual('npm test')
  })

  it('yarn run', () => {
    expect(convert('yarn custom', 'npm')).toEqual('npm run custom')
    expect(convert('yarn run custom', 'npm')).toEqual('npm run custom')
    expect(convert('yarn run add', 'npm')).toEqual('npm run add')
    expect(convert('yarn run install', 'npm')).toEqual('npm run install')
    expect(convert('yarn run run', 'npm')).toEqual('npm run run')
    // with args
    expect(convert('yarn custom -- --version', 'npm')).toEqual('npm run custom -- --version')
    expect(convert('yarn run custom --version', 'npm')).toEqual('npm run custom --version')
    expect(convert('yarn run custom -- --version', 'npm')).toEqual('npm run custom -- --version')
  })

  it('yarn list', () => {
    expect(convert('yarn list', 'npm')).toEqual('npm ls')
    expect(convert('yarn list --pattern "package"', 'npm')).toEqual('npm ls package')
    expect(convert('yarn list --pattern "package|package2"', 'npm')).toEqual(
      'npm ls package package2'
    )
    expect(convert('yarn list --pattern "@scope/package|@scope/package2"', 'npm')).toEqual(
      'npm ls @scope/package @scope/package2'
    )
    expect(convert('yarn list --production', 'npm')).toEqual('npm ls --production')
    expect(convert('yarn list --development', 'npm')).toEqual('npm ls --development')
  })

  it('npm link/unlink', () => {
    expect(convert('yarn link custom', 'npm')).toEqual('npm link custom')
    expect(convert('yarn unlink custom', 'npm')).toEqual('npm unlink custom')
  })
})
