/* global it, expect, describe */

import convert from '../src'

describe('NPM to Yarn tests', () => {
  it('Simple convert works', () => {
    expect(convert('npm install squirrelly', 'yarn')).toEqual('yarn add squirrelly')
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
})
