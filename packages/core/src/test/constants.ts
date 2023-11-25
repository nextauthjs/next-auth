export const BASE_URL = "https://next-auth-example.com"
export const AUTH_URL = `${BASE_URL}/api/auth`

const makeAuthAction = (action: string) => `${AUTH_URL}/${action}`

export const SESSION_ACTION = makeAuthAction("session")
export const SESSION_COOKIE_NAME = "__Secure-authjs.session-token"
