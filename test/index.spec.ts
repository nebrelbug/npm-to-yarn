/* global it, expect, describe */

import convert from '../src'

describe('NPM to Yarn tests', () => {
  it('Simple convert works', () => {
    expect(convert('npm install squirrelly', 'yarn')).toEqual('yarn add squirrelly')
  })

  it('Simple convert works w/ remove', () => {
    expect(convert('npm uninstall squirrelly', 'yarn')).toEqual('yarn remove squirrelly')
  })

  it('Global install', () => {
    expect(convert('npm install squirrelly --global', 'yarn')).toEqual('yarn global add squirrelly')
  })

  it('Global uninstall', () => {
    expect(convert('npm uninstall squirrelly --global', 'yarn')).toEqual(
      'yarn global remove squirrelly'
    )
  })

  it('Unchanged command', () => {
    expect(convert('npm cache clean', 'yarn')).toEqual('yarn cache clean')
  })

  it('Version works', () => {
    expect(convert('npm version major', 'yarn')).toEqual('yarn version --major')
  })

  it('npm install', () => {
    expect(convert('npm install', 'yarn')).toEqual('yarn install')
  })

  it('npm rebuild', () => {
    expect(convert('npm rebuild', 'yarn')).toEqual('yarn add --force')
  })

  it("npm whoami can't auto-convert to yarn", () => {
    expect(convert('npm whoami', 'yarn')).toEqual("yarn whoami\n# couldn't auto-convert command")
  })

  it('npm init', () => {
    expect(convert('npm init', 'yarn')).toEqual('yarn init')
    expect(convert('npm init -y', 'yarn')).toEqual('yarn init -y')
    expect(convert('npm init --yes', 'yarn')).toEqual('yarn init --yes')
    expect(convert('npm init --scope', 'yarn')).toEqual('yarn init')
    expect(convert('npm init --private', 'yarn')).toEqual('yarn init --private')
    expect(convert('npm init --unknown-arg', 'yarn')).toEqual('yarn init --unknown-arg')
    // create
    expect(convert('npm init esm --yes', 'yarn')).toEqual('yarn create esm --yes')
    expect(convert('npm init @scope/my-package', 'yarn')).toEqual('yarn create @scope/my-package')
    expect(convert('npm init react-app ./my-react-app', 'yarn')).toEqual(
      'yarn create react-app ./my-react-app'
    )
  })

  it('npm run', () => {
    expect(convert('npm run custom', 'yarn')).toEqual('yarn custom')
    expect(convert('npm run add', 'yarn')).toEqual('yarn run add')
    expect(convert('npm run install', 'yarn')).toEqual('yarn run install')
    expect(convert('npm run run', 'yarn')).toEqual('yarn run run')
    // with args
    expect(convert('npm run custom -- --version', 'yarn')).toEqual('yarn custom --version')
  })

  it('npm list', () => {
    expect(convert('npm list', 'yarn')).toEqual('yarn list')
    expect(convert('npm list package', 'yarn')).toEqual('yarn list --pattern "package"')
    expect(convert('npm list package package2', 'yarn')).toEqual(
      'yarn list --pattern "package|package2"'
    )
    expect(convert('npm list @scope/package @scope/package2', 'yarn')).toEqual(
      'yarn list --pattern "@scope/package|@scope/package2"'
    )
    expect(convert('npm list @scope/package @scope/package2 --depth=2', 'yarn')).toEqual(
      'yarn list --pattern "@scope/package|@scope/package2" --depth=2'
    )
    // alias
    expect(convert('npm ls', 'yarn')).toEqual('yarn list')
    expect(convert('npm ls package', 'yarn')).toEqual('yarn list --pattern "package"')
    expect(convert('npm ls package package2', 'yarn')).toEqual(
      'yarn list --pattern "package|package2"'
    )
    expect(convert('npm ls @scope/package @scope/package2', 'yarn')).toEqual(
      'yarn list --pattern "@scope/package|@scope/package2"'
    )
    expect(convert('npm ls @scope/package @scope/package2 --depth=2', 'yarn')).toEqual(
      'yarn list --pattern "@scope/package|@scope/package2" --depth=2'
    )
  })
})

describe('Yarn to NPM tests', () => {
  it('Simple convert works', () => {
    expect(convert('yarn add squirrelly', 'npm')).toEqual('npm install squirrelly --save')
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
    expect(convert('yarn global add squirrelly', 'npm')).toEqual('npm install squirrelly --global')
  })

  it('Yarn global remove', () => {
    expect(convert('yarn global remove squirrelly', 'npm')).toEqual(
      'npm uninstall squirrelly --global'
    )
  })

  it('Plain `yarn`', () => {
    expect(convert('yarn', 'npm')).toEqual('npm install')
  })

  it('yarn add --force', () => {
    expect(convert('yarn add --force', 'npm')).toEqual('npm rebuild')
  })

  it('Version works', () => {
    expect(convert('yarn version --major', 'npm')).toEqual('npm version major')
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
  })
})
