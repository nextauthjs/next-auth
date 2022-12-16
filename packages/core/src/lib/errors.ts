/** @internal */
export class AuthError extends Error {
  metadata?: Record<string, unknown>
  constructor(message: Error | string, metadata?: Record<string, unknown>) {
    if (message instanceof Error) {
      super(message.message)
      this.stack = message.stack
    } else super(message)
    this.name = this.constructor.name
    this.metadata = metadata
    Error.captureStackTrace?.(this, this.constructor)
  }
}

/**
 * Thrown when an Email address is already associated with an account
 * but the user is trying an OAuth account that is not linked to it.
 */
export class AccountNotLinked extends AuthError {}

/** One of the database `Adapter` methods failed. */
export class AdapterError extends AuthError {}

export class AuthorizedCallbackError extends AuthError {}

export class CallbackRouteError extends AuthError {}

export class ErrorPageLoop extends AuthError {}

export class EventError extends AuthError {}

export class InvalidCallbackUrl extends AuthError {}

export class InvalidEndpoints extends AuthError {}

export class InvalidState extends AuthError {}

export class JWTSessionError extends AuthError {}

export class MissingAdapter extends AuthError {}

export class MissingAdapterMethods extends AuthError {}

export class MissingAPIRoute extends AuthError {}

export class MissingAuthorize extends AuthError {}

export class MissingSecret extends AuthError {}

export class OAuthSignInError extends AuthError {}

export class OAuthCallbackError extends AuthError {}

export class OAuthCreateUserError extends AuthError {}

export class OAuthProfileParseError extends AuthError {}

export class SessionTokenError extends AuthError {}

export class SignInError extends AuthError {}

export class SignOutError extends AuthError {}

export class UnknownAction extends AuthError {}

export class UnsupportedStrategy extends AuthError {}

export class UntrustedHost extends AuthError {}
