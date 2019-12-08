import cleanup from 'rollup-plugin-cleanup';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/index.js',
  output: {
    file: './dist/index.js',
    format: 'esm',
    sourcemap: false,
  },
  plugins: [
    cleanup(),
    commonjs(),
    nodeResolve(),
  ]
};
