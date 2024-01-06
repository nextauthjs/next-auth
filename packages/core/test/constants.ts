export const BASE_URL = "https://next-auth-example.com"
export const AUTH_URL = `${BASE_URL}/api/auth`
export const AUTH_SECRET = "secret"

const makeAuthAction = (action: string) => `${AUTH_URL}/${action}`

export const SESSION_ACTION = makeAuthAction("session")
export const CALLBACK_ACTION = makeAuthAction("callback")
export const ERROR_ACTION = makeAuthAction("error")

export const SESSION_COOKIE_NAME = "__Secure-authjs.session-token"
export const CSRF_COOKIE_NAME = "__Host-authjs.csrf-token"
