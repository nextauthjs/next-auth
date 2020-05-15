export default (options) => {
  return {
    id: 'email',
    type: 'email',
    name: 'Email',
    from: '',
    server: 'localhost',
    port: 25,
    secure: true,
    username: '',
    password: '',
    ...options
  }
}
