export const UNKNOWN_ERROR_NAME = 'UnknownError';
export const ACCOUNT_NOT_LINKED_ERROR_NAME = 'AccountNotLinkedError';
export const CREATE_USER_ERROR_NAME = 'CreateUserError';
export const SEND_VERIFICATION_EMAIL_ERROR_NAME = "SEND_VERIFICATION_EMAIL_ERROR";

export class UnknownError extends Error {
  name = UNKNOWN_ERROR_NAME;

  constructor (message: string) {
    super(message)
  }

  // TODO: figure out why this was overridden
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
  name = CREATE_USER_ERROR_NAME;

  constructor (message: string) {
    super(message)
  }
}

export class SendVerificationEmailError extends Error {
  name = SEND_VERIFICATION_EMAIL_ERROR;

  constructor(message: string) {
    super(message);
  }
}

// Thrown when an Email address is already associated with an account
// but the user is trying an oAuth account that is not linked to it.
export class AccountNotLinkedError extends UnknownError {
  name = ACCOUNT_NOT_LINKED_ERROR_NAME;

  constructor (message: string) {
    super(message)
  }
}