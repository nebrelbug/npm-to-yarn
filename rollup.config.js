import typescript from 'rollup-plugin-typescript2'

// TODO: Someday don't transpile ES6 module dist files to ES5, ex. removing classes
const pkg = require('./package.json')

export default [
  {
    input: 'src/index.ts', // todo: use rollup-plugin-replace
    output: [
      {
        file: 'dist/npm-to-yarn.js',
        format: 'umd',
        name: 'n2y',
        sourcemap: true
      }
    ],
    plugins: [typescript({ useTsconfigDeclarationDir: true })],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [],
    watch: {
      include: 'src/**'
    }
  }
]
