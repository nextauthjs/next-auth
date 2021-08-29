import { createHash, randomBytes } from "crypto"
import { NextAuthRequest, NextAuthResponse } from "../../lib/types"
import * as cookie from "./cookie"

/**
 * Ensure CSRF Token cookie is set for any subsequent requests.
 * Used as part of the strategy for mitigation for CSRF tokens.
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
export default function csrfTokenHandler(
  req: NextAuthRequest,
  res: NextAuthResponse
) {
  const { cookies, secret } = req.options
  if (cookies.csrfToken.name in req.cookies) {
    const [csrfToken, csrfTokenHash] =
      req.cookies[cookies.csrfToken.name].split("|")
    const expectedCsrfTokenHash = createHash("sha256")
      .update(`${csrfToken}${secret}`)
      .digest("hex")
    if (csrfTokenHash === expectedCsrfTokenHash) {
      // If hash matches then we trust the CSRF token value
      // If this is a POST request and the CSRF Token in the POST request matches
      // the cookie we have already verified is the one we have set, then the token is verified!
      const csrfTokenVerified =
        req.method === "POST" && csrfToken === req.body.csrfToken
      req.options.csrfToken = csrfToken
      req.options.csrfTokenVerified = csrfTokenVerified
      return
    }
  }
  // If no csrfToken from cookie - because it's not been set yet,
  // or because the hash doesn't match (e.g. because it's been modifed or because the secret has changed)
  // create a new token.
  const csrfToken = randomBytes(32).toString("hex")
  const csrfTokenHash = createHash("sha256")
    .update(`${csrfToken}${secret}`)
    .digest("hex")
  const csrfTokenCookie = `${csrfToken}|${csrfTokenHash}`
  cookie.set(
    res,
    cookies.csrfToken.name,
    csrfTokenCookie,
    cookies.csrfToken.options
  )
  req.options.csrfToken = csrfToken
}
