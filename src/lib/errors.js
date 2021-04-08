export class UnknownError extends Error {
  constructor (message) {
    super(message)
    this.name = 'UnknownError'
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

export class CreateUserError extends UnknownError {
  constructor (message) {
    super(message)
    this.name = 'CreateUserError'
  }
}

// Thrown when an Email address is already associated with an account
// but the user is trying an OAuth account that is not linked to it.
export class AccountNotLinkedError extends UnknownError {
  constructor (message) {
    super(message)
    this.name = 'AccountNotLinkedError'
  }
}

export class OAuthCallbackError extends UnknownError {
  constructor (message) {
    super(message)
    this.name = 'OAuthCallbackError'
  }
}
