"use strict";

class UnknownError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnknownError';
    this.message = message;
  }

  toJSON() {
    return {
      error: {
        name: this.name,
        message: this.message
      }
    };
  }

}

class CreateUserError extends UnknownError {
  constructor(message) {
    super(message);
    this.name = 'CreateUserError';
    this.message = message;
  }

}

class AccountNotLinkedError extends UnknownError {
  constructor(message) {
    super(message);
    this.name = 'AccountNotLinkedError';
    this.message = message;
  }

}

module.exports = {
  UnknownError,
  CreateUserError,
  AccountNotLinkedError
};