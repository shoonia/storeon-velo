import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';
import copy from 'rollup-plugin-copy';

const babelPlugin = getBabelOutputPlugin({
  presets: [
    [
      '@babel/preset-env',
      {
        loose: true,
        useBuiltIns: 'entry',
        targets: 'defaults',
      },
    ],
  ],
});

export default [
  {
    input: './src/index.js',
    output: [
      {
        file: './lib/esm.js',
        format: 'esm',
      },
      {
        file: './lib/es5.esm.js',
        format: 'esm',
        plugins: [
          babelPlugin,
        ],
      },
      {
        file: './lib/es5.cjs.js',
        format: 'cjs',
        plugins: [
          babelPlugin,
        ],
      },
    ],
    plugins: [
      commonjs(),
      nodeResolve(),
    ],
  },
  {
    input: './node_modules/storeon/index.js',
    output: [
      {
        file: './core/index.js',
        format: 'esm',
      },
    ],
    plugins: [
      babelPlugin,
      copy({
        targets: [
          {
            src: './node_modules/storeon/index.d.ts',
            dest: 'core',
          },
        ],
      }),
    ],
  },
];
