class UnknownError extends Error {
  constructor (message) {
    super(message)
    this.name = 'UnknownError'
    this.message = message
  }

  toJSON () {
    return {
      error: {
        name: this.name,
        message: this.message
        // stack: this.stack
      }
    }
  }
}

class CreateUserError extends UnknownError {
  constructor (message) {
    super(message)
    this.name = 'CreateUserError'
    this.message = message
  }
}

module.exports = {
  UnknownError,
  CreateUserError
}
