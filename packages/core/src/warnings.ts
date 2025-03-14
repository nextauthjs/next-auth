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
 *
 */
export type WarningCode =
  | "debug-enabled"
  | "csrf-disabled"
  | "env-url-basepath-redundant"
  | "env-url-basepath-mismatch"
  | "experimental-webauthn"
