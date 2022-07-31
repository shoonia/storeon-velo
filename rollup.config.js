import { rmSync, existsSync } from 'node:fs';
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
      interop: false,
      esModule: false,
    },
  ],
  plugins: [
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
