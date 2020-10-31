import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

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

export default {
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
};
