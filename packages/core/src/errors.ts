type ErrorOptions = Error | Record<string, unknown>

export class AuthError extends Error {
  /** @internal Used to brand errors instead of using `this.constructor.name`, which might be minified during builds. */
  type: string
  /** Determines on which page an error should be handled. Typically `signIn` errors can be handled in-page. */
  kind?: "signIn" | "error"
  cause?: Record<string, unknown> & { err?: Error }
  constructor(
    message?: string | Error | ErrorOptions,
    errorOptions?: ErrorOptions
  ) {
    if (message instanceof Error) {
      super(undefined, {
        cause: { err: message, ...(message.cause as any), ...errorOptions },
      })
    } else if (typeof message === "string") {
      if (errorOptions instanceof Error) {
        errorOptions = { err: errorOptions, ...(errorOptions.cause as any) }
      }
      super(message, errorOptions)
    } else {
      super(undefined, message)
    }
    this.name = this.constructor.name
    // @ts-expect-error https://github.com/microsoft/TypeScript/issues/3841
    this.type = this.constructor.type ?? "AuthError"
    // @ts-expect-error https://github.com/microsoft/TypeScript/issues/3841
    this.kind = this.constructor.kind ?? "error"

    Error.captureStackTrace?.(this, this.constructor)
    const url = `https://errors.authjs.dev#${this.type.toLowerCase()}`
    this.message += `${this.message ? " ." : ""}Read more at ${url}`
  }
}

export class SignInError extends AuthError {
  static kind = "signIn"
}

/**
 * @todo
 * One of the database `Adapter` methods failed.
 */
export class AdapterError extends AuthError {
  static type = "AdapterError"
}

/**
 * Happens when the user is not authorized to access a route after executing the `signIn` callback.
 */
export class AuthorizedCallbackError extends AuthError {
  static type = "AuthorizedCallbackError"
}

/**
 * This error occurs when the user cannot finish login.
 * Depending on the provider type, this could have happened for multiple reasons.
 *
 * :::tip
 * Check out `[auth][details]` in the error message to know which provider failed.
 * @example
 * ```sh
 * [auth][details]: { "provider": "github" }
 * ```
 * :::
 *
 * For an [OAuth provider](https://authjs.dev/reference/core/providers/oauth), possible causes are:
 * - The user denied access to the application
 * - There was an error parsing the OAuth Profile:
 *   Check out the provider's `profile` or `userinfo.request` method to make sure
 *   it correctly fetches the user's profile.
 * - The `signIn` or `jwt` callback methods threw an uncaught error:
 *   Check the callback method implementations.
 *
 * For an [Email provider](https://authjs.dev/reference/core/providers/email), possible causes are:
 * - The provided email/token combination was invalid/missing:
 *   Check if the provider's `sendVerificationRequest` method correctly sends the email.
 * - The provided email/token combination has expired:
 *   Ask the user to log in again.
 * - There was an error with the database:
 *   Check the database logs.
 *
 * For a [Credentials provider](https://authjs.dev/reference/core/providers/credentials), possible causes are:
 * - The `authorize` method threw an uncaught error:
 *   Check the provider's `authorize` method.
 * - The `signIn` or `jwt` callback methods threw an uncaught error:
 *   Check the callback method implementations.
 *
 * :::tip
 * Check out `[auth][cause]` in the error message for more details.
 * It will show the original stack trace.
 * :::
 */
export class CallbackRouteError extends AuthError {
  static type = "CallbackRouteError"
}

/** @todo */
export class ErrorPageLoop extends AuthError {
  static type = "ErrorPageLoop"
}

/** @todo */
export class EventError extends AuthError {
  static type = "EventError"
}

/** @todo */
export class InvalidCallbackUrl extends AuthError {
  static type = "InvalidCallbackUrl"
}

/**
 * The `authorize` callback returned `null` in the [Credentials provider](https://authjs.dev/getting-started/providers/credentials-tutorial).
 * We don't recommend providing information about which part of the credentials were wrong, as it might be abused by malicious hackers.
 */
export class CredentialsSignin extends SignInError {
  static type = "CredentialsSignin"
}

/** @todo */
export class InvalidEndpoints extends AuthError {
  static type = "InvalidEndpoints"
}

/** @todo */
export class InvalidCheck extends AuthError {
  static type = "InvalidCheck"
}

/** @todo */
export class JWTSessionError extends AuthError {
  static type = "JWTSessionError"
}

/** @todo */
export class MissingAdapter extends AuthError {
  static type = "MissingAdapter"
}

/** @todo */
export class MissingAdapterMethods extends AuthError {
  static type = "MissingAdapterMethods"
}

/** @todo */
export class MissingAPIRoute extends AuthError {
  static type = "MissingAPIRoute"
}

/** @todo */
export class MissingAuthorize extends AuthError {
  static type = "MissingAuthorize"
}

/**
 * Auth.js requires a secret to be set, but none was not found. This is used to encrypt cookies, JWTs and other sensitive data.
 *
 * :::note
 * If you are using a framework like Next.js, we try to automatically infer the secret from the `AUTH_SECRET` environment variable.
 * Alternatively, you can also explicitly set the [`AuthConfig.secret`](https://authjs.dev/reference/core#secret).
 * :::
 *
 *
 * :::tip
 * You can generate a good secret value:
 *  - On Unix systems: type `openssl rand -hex 32` in the terminal
 *  - Or generate one [online](https://generate-secret.vercel.app/32)
 *
 * :::
 */
export class MissingSecret extends AuthError {
  static type = "MissingSecret"
}

/**
 * @todo
 * Thrown when an Email address is already associated with an account
 * but the user is trying an OAuth account that is not linked to it.
 */
export class OAuthAccountNotLinked extends SignInError {
  static type = "OAuthAccountNotLinked"
}

/**
 * Thrown when an OAuth provider returns an error during the sign in process.
 * This could happen for example if the user denied access to the application or there was a configuration error.
 *
 * For a full list of possible reasons, check out the specification [Authorization Code Grant: Error Response](https://www.rfc-editor.org/rfc/rfc6749#section-4.1.2.1)
 */
export class OAuthCallbackError extends SignInError {
  static type = "OAuthCallbackError"
}

/** @todo */
export class OAuthCreateUserError extends AuthError {
  static type = "OAuthCreateUserError"
}

/**
 * This error occurs during an OAuth sign in attempt when the provdier's
 * response could not be parsed. This could for example happen if the provider's API
 * changed, or the [`OAuth2Config.profile`](https://authjs.dev/reference/core/providers/oauth#profile) method is not implemented correctly.
 */
export class OAuthProfileParseError extends AuthError {
  static type = "OAuthProfileParseError"
}

/** @todo */
export class SessionTokenError extends AuthError {
  static type = "SessionTokenError"
}

/**
 * Happens when login by [OAuth](https://authjs.dev/getting-started/providers/oauth-tutorial) could not be started.
 *
 * Possible causes are:
 * - The Authorization Server is not compliant with the [OAuth 2.0](https://www.ietf.org/rfc/rfc6749.html) or the [OIDC](https://openid.net/specs/openid-connect-core-1_0.html) specification.
 *   Check the details in the error message.
 *
 * :::tip
 * Check out `[auth][details]` in the error message to know which provider failed.
 * @example
 * ```sh
 * [auth][details]: { "provider": "github" }
 * ```
 * :::
 */
export class OAuthSignInError extends SignInError {
  static type = "OAuthSignInError"
}

/**
 * Happens when the login by an [Email provider](https://authjs.dev/getting-started/providers/email-tutorial) could not be started.
 *
 * Possible causes are:
 * - The email sent from the client is invalid, could not be normalized by [`EmailConfig.normalizeIdentifier`](https://authjs.dev/reference/core/providers/email#normalizeidentifier)
 * - The provided email/token combination has expired:
 *   Ask the user to log in again.
 * - There was an error with the database:
 *   Check the database logs.
 */
export class EmailSignInError extends SignInError {
  static type = "EmailSignInError"
}

/** @todo */
export class SignOutError extends AuthError {
  static type = "SignOutError"
}

/**
 * Auth.js was requested to handle an operation that it does not support.
 *
 * See [`AuthAction`](https://authjs.dev/reference/core/types#authaction) for the supported actions.
 */
export class UnknownAction extends AuthError {
  static type = "UnknownAction"
}

/** @todo */
export class UnsupportedStrategy extends AuthError {
  static type = "UnsupportedStrategy"
}

/** @todo */
export class InvalidProvider extends AuthError {
  static type = "InvalidProvider"
}

/** @todo */
export class UntrustedHost extends AuthError {
  static type = "UntrustedHost"
}

/**
 * The user's email/token combination was invalid.
 * This could be because the email/token combination was not found in the database,
 * or because the token has expired. Ask the user to log in again.
 */
export class Verification extends AuthError {
  static type = "Verification"
}

export class MissingCSRF extends AuthError {
  static type = "MissingCSRF"
}
