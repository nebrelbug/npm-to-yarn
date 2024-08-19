'use strict'

// @ts-check
/** @type {import('@jest/types').Config.InitialOptions} */
module.exports = {
  transform: {
    '.(ts)': 'ts-jest'
  },
  testEnvironment: 'node',
  testRegex: '(/test/.*|\\.(test|spec))\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/test/', 'src/lib.ts'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 95,
      lines: 95,
      statements: 95
    }
  },
  collectCoverageFrom: ['src/*.ts']
}
