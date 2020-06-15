export default (options) => {
  return {
    id: 'credentials',
    name: 'Credentials',
    type: 'credentials',
    authorize: null,
    ...options
  }
}
