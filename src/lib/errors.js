/**
 * Same as the default `Error`, but it is JSON serializable.
 * @source https://iaincollins.medium.com/error-handling-in-javascript-a6172ccdf9af
 */
export class UnknownError extends Error {
  constructor(error) {
    // Support passing error or string
    super(error?.message ?? error)
    this.name = "UnknownError"
    if (error instanceof Error) {
      this.stack = error.stack
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      stack: this.stack,
    }
  }
}

export class OAuthCallbackError extends UnknownError {
  name = "OAuthCallbackError"
}

/**
 * Thrown when an Email address is already associated with an account
 * but the user is trying an OAuth account that is not linked to it.
 */
export class AccountNotLinkedError extends UnknownError {
  name = "AccountNotLinkedError"
}

export class CreateUserError extends UnknownError {
  name = "CreateUserError"
}

export class GetUserError extends UnknownError {
  name = "GetUserError"
}

export class GetUserByEmailError extends UnknownError {
  name = "GetUserByEmailError"
}

export class GetUserByIdError extends UnknownError {
  name = "GetUserByIdError"
}

export class GetUserByProviderAccountIdError extends UnknownError {
  name = "GetUserByProviderAccountIdError"
}

export class UpdateUserError extends UnknownError {
  name = "UpdateUserError"
}

export class DeleteUserError extends UnknownError {
  name = "DeleteUserError"
}

export class LinkAccountError extends UnknownError {
  name = "LinkAccountError"
}

export class UnlinkAccountError extends UnknownError {
  name = "UnlinkAccountError"
}

export class CreateSessionError extends UnknownError {
  name = "CreateSessionError"
}

export class GetSessionError extends UnknownError {
  name = "GetSessionError"
}

export class UpdateSessionError extends UnknownError {
  name = "UpdateSessionError"
}

export class DeleteSessionError extends UnknownError {
  name = "DeleteSessionError"
}

export class CreateVerificationRequestError extends UnknownError {
  name = "CreateVerificationRequestError"
}

export class GetVerificationRequestError extends UnknownError {
  name = "GetVerificationRequestError"
}

export class DeleteVerificationRequestError extends UnknownError {
  name = "DeleteVerificationRequestError"
}
