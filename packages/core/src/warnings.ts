/**
 * - `debug-enabled`: The `debug` option was evaluated to `true`. It adds extra logs in the terminal which is useful in development,
 *   but since it can print sensitive information about users, make sure to set this to `false` in production.
 *   In Node.js environments, you can for example set `debug: process.env.NODE_ENV !== "production"`.
 *   Consult with your runtime/framework on how to set this value correctly.
 * - `csrf-disabled`: You were trying to get a CSRF response from Auth.js (eg.: by calling a `/csrf` endpoint),
 *   but in this setup, CSRF protection via Auth.js was turned off. This is likely if you are not directly using `@auth/core`
 *   but a framework library (like `@auth/sveltekit`) that already has CSRF protection built-in. You likely won't need the CSRF response.
 * - `env-url-basepath-redundant`: `AUTH_URL` (or `NEXTAUTH_URL`) and `authConfig.basePath` are both declared. This is a configuration mistake - you should either remove the `authConfig.basePath` configuration,
 *   or remove the `pathname` of `AUTH_URL` (or `NEXTAUTH_URL`). Only one of them is needed.
 * - `env-url-basepath-mismatch`: `AUTH_URL` (or `NEXTAUTH_URL`) and `authConfig.basePath` are both declared, but they don't match. This is a configuration mistake.
 *   `@auth/core` will use `basePath` to construct the full URL to the corresponding action (/signin, /signout, etc.) in this case.
 * - `experimental-webauthn`: Experimental WebAuthn feature is enabled.
 * - `oauth-issuer-not-configured`: The authorization server returned an `iss` (issuer) response parameter,
 *   as described in [RFC 9207](https://www.rfc-editor.org/rfc/rfc9207.html), but the provider has no `issuer`
 *   configured to validate it against, so the parameter was ignored. Set `issuer` on the provider to have it checked.
 *
 */
export type WarningCode =
  | "debug-enabled"
  | "csrf-disabled"
  | "env-url-basepath-redundant"
  | "env-url-basepath-mismatch"
  | "experimental-webauthn"
  | "oauth-issuer-not-configured"
