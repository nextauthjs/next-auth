class UnknownError extends Error {
  constructor(message) {
    super(message)
    this.name = 'UnknownError'
    this.message = message
  }
  
  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message,
        // stack: this.stack
      }
    }
  }
}

class AlreadyExistsError extends UnknownError {
  constructor(message) {
    super(message)
    this.name = 'AlreadyExistsError'
    this.message = message
  }
}

module.exports = {
  UnknownError,
  AlreadyExistsError
}