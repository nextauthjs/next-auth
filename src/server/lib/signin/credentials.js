export default async (email, password, provider, options) => {
  try {
    const login = options.doLogin(email, password)

    if (login.success === true) {
      return login
    } else {
      throw Error('Wrong password')
    }

    // Return promise
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}
