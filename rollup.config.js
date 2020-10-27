import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import { getBabelOutputPlugin } from '@rollup/plugin-babel';

export default {
  input: './src/index.js',
  output: [
    {
      file: './dist/index.esm.js',
      format: 'esm',
    },
    {
      file: './dist/index.cjs.js',
      format: 'cjs',
    },
    {
      file: './dist/index.js',
      format: 'cjs',
      plugins: [
        getBabelOutputPlugin({
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
        }),
      ],
    },
  ],
  plugins: [
    commonjs(),
    nodeResolve(),
  ]
};
