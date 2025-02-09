const typescript = require('rollup-plugin-typescript2')
const commonjs = require('@rollup/plugin-commonjs')
const { babel } = require('@rollup/plugin-babel')
const del = require('rollup-plugin-delete')
const { dts } = require('rollup-plugin-dts')

module.exports = [
  {
    input: './index.ts',
    output: {
      format: 'cjs',
      file: './lib/index.js'
    },
    // external: ['crypto-js'],
    plugins: [
      commonjs(),
      babel({
        babelHelpers: 'bundled'
      }),
      typescript(),
      del({
        targets: 'lib/*'
      })
    ]
  },
  {
    input: './loaders/scope-id-loader.ts',
    output: {
      format: 'cjs',
      file: './lib/loader.js'
    },
    nodenext: {},
    external: ['crypto-js', 'webpack'],
    plugins: [
      commonjs(),
      babel({
        babelHelpers: 'bundled'
      }),
      typescript()
    ]
  },
  {
    input: {
      index: './index.ts',
      loader: './loaders/scope-id-loader.ts'
    },
    output: [
      {
        format: 'cjs',
        dir: './lib'
      },
    ],
    plugins: [
      dts()
    ]
  }
]