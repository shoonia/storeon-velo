import { rmSync, existsSync } from 'fs';
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';

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
  ],
};
