import { rmSync, existsSync } from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';

if (existsSync('./lib')) {
  rmSync('./lib', { recursive: true });
}

export default {
  input: './src/index.js',
  output: [
    {
      file: './lib/index.js',
      format: 'es',
    },
    {
      file: './lib/index.cjs',
      format: 'cjs',
    },
  ],
  plugins: [
    commonjs(),
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
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
};
