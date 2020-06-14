/**
 * Use this callback to control if a user is allowed to sign in or not.
 *
 * This is triggered before sign in flow completes, so the user profile may be
 * a user object (with an ID) or it may be just their name and email address,
 * depending on the sign in flow and if they have an account already.
 *
 * When using email sign in, this method is triggered both when the user
 * requests to sign in and again when they activate the link in the sign in
 * email.
 *
 * @param  {object} profile  User profile (e.g. user id, name, email)
 * @param  {object} account  Account used to sign in (e.g. OAuth account)
 * @param  {object} metadata Provider specific metadata (e.g. OAuth Profile)
 * @return {boolean|object}  Return `true` (or a modified JWT) to allow sign in
 *                           Return `false` to deny access
 */
const signin = async (profile, account, metadata) => {
  const isAllowedToSignIn = true
  if (isAllowedToSignIn) {
    return Promise.resolve(true)
  } else {
    return Promise.resolve(false)
  }
}

/**
 * Redirect is called anytime the user is redirected on signin or signout.
 * By default, for security, only Callback URLs on the same URL as the site
 * are allowed, you can use this callback to customise that behaviour.
 *
 * @param  {string} url      URL provided as callback URL by the client
 * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
 * @return {string}          URL the client will be redirect to
 */
const redirect = async (url, baseUrl) => {
  return url.startsWith(baseUrl)
    ? Promise.resolve(url)
    : Promise.resolve(baseUrl)
}

/**
 * This callback is called whenever a session is checked.
 * e.g. `getSession()`, `useSession()`, `/api/auth/session` (etc)
 *
 * @param  {object} session  Session that is returned to client
 * @return {object}          Return session
 */
const session = async (session) => {
  return Promise.resolve(session)
}

/**
 * This callback is called whenever a JSON Web Token is created / updated.
 * e.g. On sign in, `getSession()`, `useSession()`, `/api/auth/session` (etc)
 *
 * @param  {object} token  Decrypted JSON Web Token
 * @return {object}        Return  JSON Web Token
 */
const jwt = async (token) => {
  return Promise.resolve(token)
}

export default {
  signin,
  redirect,
  session,
  jwt
}
