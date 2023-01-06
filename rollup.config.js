import { rmSync, existsSync } from 'node:fs';

['./lib', './legacy'].forEach((path) => {
  if (existsSync(path)) {
    rmSync(path, { recursive: true });
  }
});

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
