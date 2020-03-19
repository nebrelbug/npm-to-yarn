import typescript from 'rollup-plugin-typescript2'

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
