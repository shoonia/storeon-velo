import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';

if (existsSync('./lib')) {
  await rm('./lib', { recursive: true });
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
