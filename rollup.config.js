import babel from 'rollup-plugin-babel'

export default {
  input: 'src/client/index.js',
  output: {
    name: 'next-auth-client',
    file: 'client.js',
    format: 'umd',
    globals: {
      'fetch': 'isomorphic-fetch'
    }
  },
  plugins: [
    babel({
      babelrc: false,
      exclude: [ 'node_modules/**' ],
      presets: [['env', { modules: false }]]
    })
  ],
  
}