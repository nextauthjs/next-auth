/**
 * Use this callback to control if a user is allowed to sign in or not.
 * If JSON Web Tokens are enabled you can access the JWT here.
 * If you want to modify the JWT, return the modifed token as the response.
 * 
 * @param  {object} user     User (e.g. user id, name, email)
 * @param  {object} account  Account used to sign in (e.g. OAuth account)
 * @param  {object} extra    Provider specific metadata (e.g. OAuth Profile)
 * @param  {object} jwt      If JSON Web Tokens enabled contains decrypted JWT
 * @return {boolean|object}  Return `true` (or a modified JWT) to allow sign in
 *                           Return `false` to deny access
 */
const signin = async (user, account, extra, jwt) => {
  let isAllowedToSignIn = true
  if (isAllowedToSignIn) {
    return Promise.resolve(jwt ? jwt : true)
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
 * This callback is called whenever a session is checked
 * e.g. `getSession()`, `useSession()`, `/api/auth/session` (etc)
 * 
 * You can modify the session object and/or the JSON Web Token.
 * Changes to the JWT will be persised in the token.
 * 
 * @param  {object} session  Session that is returned to client
 * @param  {object} jwt      Decrypted JSON Web Token
 * @return {object}          Return both Session and JWT objects
 */
const session = async (session, jwt) => {
  Promise.resolve({
    session,
    jwt
  })
}

export default {
  signin,
  redirect,
  session
}