import { createHash, randomBytes } from 'crypto'
import * as cookie from './cookie'

/**
 * Ensure CSRF Token cookie is set for any subsequent requests.
 * Used as part of the strateigy for mitigation for CSRF tokens.
 *
 * Creates a cookie like 'next-auth.csrf-token' with the value 'token|hash',
 * where 'token' is the CSRF token and 'hash' is a hash made of the token and
 * the secret, and the two values are joined by a pipe '|'. By storing the
 * value and the hash of the value (with the secret used as a salt) we can
 * verify the cookie was set by the server and not by a malicous attacker.
 *
 * For more details, see the following OWASP links:
 * https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie
 * https://owasp.org/www-chapter-london/assets/slides/David_Johansson-Double_Defeat_of_Double-Submit_Cookie.pdf
 */
export default function csrfTokenHandler (req, res, cookies, secret) {
  const { csrfToken: csrfTokenFromRequest } = req.body

  let csrfTokenFromCookie
  let csrfTokenVerified = false
  if (req.cookies[cookies.csrfToken.name]) {
    const [csrfTokenValue, csrfTokenHash] = req.cookies[cookies.csrfToken.name].split('|')
    if (csrfTokenHash === createHash('sha256').update(`${csrfTokenValue}${secret}`).digest('hex')) {
      // If hash matches then we trust the CSRF token value
      csrfTokenFromCookie = csrfTokenValue

      // If this is a POST request and the CSRF Token in the Post request matches
      // the cookie we have already verified is one we have set, then token is verified!
      if (req.method === 'POST' && csrfTokenFromCookie === csrfTokenFromRequest) { csrfTokenVerified = true }
    }
  }
  if (!csrfTokenFromCookie) {
    // If no csrfToken - because it's not been set yet, or because the hash doesn't match
    // (e.g. because it's been modifed or because the secret has changed) create a new token.
    csrfTokenFromCookie = randomBytes(32).toString('hex')
    const newCsrfTokenCookie = `${csrfTokenFromCookie}|${createHash('sha256').update(`${csrfTokenFromCookie}${secret}`).digest('hex')}`
    cookie.set(res, cookies.csrfToken.name, newCsrfTokenCookie, cookies.csrfToken.options)
  }
  return { csrfToken: csrfTokenFromCookie, csrfTokenVerified }
}
