import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: './src/index.js',
  output: [
    {
      file: './dist/index.esm.js',
      format: 'esm',
      sourcemap: false,
    },
    {
      file: './dist/index.js',
      format: 'cjs',
      sourcemap: false,
    },
  ],
  plugins: [
    commonjs(),
    nodeResolve(),
  ]
};
