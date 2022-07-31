import { rmSync, existsSync } from 'node:fs';

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
};
