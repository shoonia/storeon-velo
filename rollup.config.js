import { rmSync, existsSync } from 'node:fs';

if (existsSync('./lib')) {
  rmSync('./lib', { recursive: true });
}

if (existsSync('./legacy')) {
  rmSync('./legacy', { recursive: true });
}

export default [
  {
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
  },
  {
    input: './src/legacy.js',
    output: [
      {
        file: './legacy/index.js',
        format: 'es',
      },
      {
        file: './legacy/index.cjs',
        format: 'cjs',
        interop: false,
        esModule: false,
      },
    ],
  }
];
