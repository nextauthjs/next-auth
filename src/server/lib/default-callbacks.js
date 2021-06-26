// @ts-check

/** @type {import("types").CallbacksOptions["signIn"]} */
export function signIn() {
  return true
}

/** @type {import("types").CallbacksOptions["redirect"]} */
export function redirect({ url, baseUrl }) {
  if (url.startsWith(baseUrl)) {
    return url
  }
  return baseUrl
}

/** @type {import("types").CallbacksOptions["session"]} */
export function session({ session }) {
  return session
}

/** @type {import("types").CallbacksOptions["jwt"]} */
export function jwt({ token }) {
  return token
}
