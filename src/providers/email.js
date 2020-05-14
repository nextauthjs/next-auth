export default (options) => {
  return {
    id: 'email',
    type: 'email',
    from: '',
    server: 'localhost',
    port: 25,
    secure: true,
    username: '',
    password: '',
    ...options
  }
}
