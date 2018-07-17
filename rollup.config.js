export default {
  input: 'src/client/index.js',
  output: {
    name: 'next-auth-client',
    file: 'client.js',
    format: 'umd',
    globals: {
      'fetch': 'isomorphic-fetch'
    }
  }
}