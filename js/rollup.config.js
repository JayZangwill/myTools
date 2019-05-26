import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'

export default [{
  input: 'myTools.js',
  output: [{
    file: 'dist/myTools.esm.js',
    format: 'es'
  }, {
    file: 'dist/myTools.umd.js',
    format: 'umd',
    name: 'jay'
  }],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      runtimeHelpers: true
    })
  ]
}];
