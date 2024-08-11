import typescript from '@rollup/plugin-typescript'

export default [
  {
    input: 'src/index.ts', // todo: use rollup-plugin-replace
    output: [
      {
        file: 'dist/npm-to-yarn.mjs',
        format: 'es',
        name: 'n2y',
        sourcemap: true,
        globals: {
          shiki: 'shiki'
        }
      },
      {
        file: 'dist/npm-to-yarn.umd.js',
        format: 'umd',
        name: 'n2y',
        sourcemap: true,
        globals: {
          shiki: 'shiki'
        }
      }
    ],
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        compilerOptions: {
          declarationDir: './types',
          sourceMap: true,
          inlineSources: true
        }
      })
    ],
    // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    external: [
      'shiki',
    ],
    watch: {
      include: 'src/**'
    }
  }
]
