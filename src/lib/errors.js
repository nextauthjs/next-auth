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

// Thrown when an Email address is already associated with an account
// but the user is trying an oAuth account that is not linked to it.
class AccountNotLinkedError extends UnknownError {
  constructor (message) {
    super(message)
    this.name = 'AccountNotLinkedError'
    this.message = message
  }
}

module.exports = {
  UnknownError,
  CreateUserError,
  AccountNotLinkedError
}
