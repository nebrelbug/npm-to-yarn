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
})
