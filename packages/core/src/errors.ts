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
 * @todo
 * Thrown when an Email address is already associated with an account
 * but the user is trying an OAuth account that is not linked to it.
 */
export class AccountNotLinked extends AuthError {}

/**
 * @todo
 * One of the database `Adapter` methods failed.
 */
export class AdapterError extends AuthError {}

/** @todo */
export class AuthorizedCallbackError extends AuthError {}

/** @todo */
export class CallbackRouteError extends AuthError {}

/** @todo */
export class ErrorPageLoop extends AuthError {}

/** @todo */
export class EventError extends AuthError {}

/** @todo */
export class InvalidCallbackUrl extends AuthError {}

/** @todo */
export class InvalidEndpoints extends AuthError {}

/** @todo */
export class InvalidState extends AuthError {}

/** @todo */
export class JWTSessionError extends AuthError {}

/** @todo */
export class MissingAdapter extends AuthError {}

/** @todo */
export class MissingAdapterMethods extends AuthError {}

/** @todo */
export class MissingAPIRoute extends AuthError {}

/** @todo */
export class MissingAuthorize extends AuthError {}

/** @todo */
export class MissingSecret extends AuthError {}

/** @todo */
export class OAuthSignInError extends AuthError {}

/** @todo */
export class OAuthCallbackError extends AuthError {}

/** @todo */
export class OAuthCreateUserError extends AuthError {}

/** @todo */
export class OAuthProfileParseError extends AuthError {}

/** @todo */
export class SessionTokenError extends AuthError {}

/** @todo */
export class SignInError extends AuthError {}

/** @todo */
export class SignOutError extends AuthError {}

/** @todo */
export class UnknownAction extends AuthError {}

/** @todo */
export class UnsupportedStrategy extends AuthError {}

/** @todo */
export class UntrustedHost extends AuthError {}
