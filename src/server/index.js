import { createHash, randomBytes } from 'crypto'
import jwt from '../lib/jwt'
import parseUrl from '../lib/parse-url'
import * as cookie from './lib/cookie'
import callbackUrlHandler from './lib/callback-url-handler'
import parseProviders from './lib/providers'
import * as events from './lib/events'
import * as defaultCallbacks from './lib/defaultCallbacks'
import providers from './routes/providers'
import signin from './routes/signin'
import signout from './routes/signout'
import callback from './routes/callback'
import session from './routes/session'
import renderPage from './pages'
import adapters from '../adapters'
import logger from '../lib/logger'
import redirect from './lib/redirect'

// To work properly in production with OAuth providers the NEXTAUTH_URL
// environment variable must be set.
if (!process.env.NEXTAUTH_URL) {
  logger.warn('NEXTAUTH_URL', 'NEXTAUTH_URL environment variable not set')
}

async function NextAuthHandler (req, res, userOptions) {
  // To the best of my knowledge, we need to return a promise here
  // to avoid early termination of calls to the serverless function
  // (and then return that promise when we are done) - eslint
  // complains but I'm not sure there is another way to do this.
  return new Promise(async resolve => { // eslint-disable-line no-async-promise-executor
    // This is passed to all methods that handle responses, and must be called
    // when they are complete so that the serverless function knows when it is
    // safe to return and that no more data will be sent.

    const originalResEnd = res.end.bind(res)
    res.end = (...args) => {
      resolve()
      return originalResEnd(...args)
    }
    res.redirect = redirect(req, res)

    if (!req.query.nextauth) {
      const error = 'Cannot find [...nextauth].js in pages/api/auth. Make sure the filename is written correctly.'

      logger.error('MISSING_NEXTAUTH_API_ROUTE_ERROR', error)
      res.status(500)
      return res.end(`Error: ${error}`)
    }

    const { url, query, body } = req
    const {
      nextauth,
      action = nextauth[0],
      provider = nextauth[1],
      error = nextauth[1]
    } = query

    const {
      csrfToken: csrfTokenFromPost
    } = body

    // @todo refactor all existing references to baseUrl and basePath
    const { basePath, baseUrl } = parseUrl(process.env.NEXTAUTH_URL || process.env.VERCEL_URL)

    // Parse database / adapter
    let adapter
    if (userOptions.adapter) {
      // If adapter is provided, use it (advanced usage, overrides database)
      adapter = userOptions.adapter
    } else if (userOptions.database) {
      // If database URI or config object is provided, use it (simple usage)
      adapter = adapters.Default(userOptions.database)
    }

    // Secret used salt cookies and tokens (e.g. for CSRF protection).
    // If no secret option is specified then it creates one on the fly
    // based on options passed here. A options contains unique data, such as
    // OAuth provider secrets and database credentials it should be sufficent.
    const secret = userOptions.secret || createHash('sha256').update(JSON.stringify({
      baseUrl, basePath, ...userOptions
    })).digest('hex')

    // Use secure cookies if the site uses HTTPS
    // This being conditional allows cookies to work non-HTTPS development URLs
    // Honour secure cookie option, which sets 'secure' and also adds '__Secure-'
    // prefix, but enable them by default if the site URL is HTTPS; but not for
    // non-HTTPS URLs like http://localhost which are used in development).
    // For more on prefixes see https://googlechrome.github.io/samples/cookie-prefixes/
    const useSecureCookies = userOptions.useSecureCookies || baseUrl.startsWith('https://')
    const cookiePrefix = useSecureCookies ? '__Secure-' : ''

    // @TODO Review cookie settings (names, options)
    const cookies = {
      // default cookie options
      sessionToken: {
        name: `${cookiePrefix}next-auth.session-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: useSecureCookies
        }
      },
      callbackUrl: {
        name: `${cookiePrefix}next-auth.callback-url`,
        options: {
          sameSite: 'lax',
          path: '/',
          secure: useSecureCookies
        }
      },
      csrfToken: {
        // Default to __Host- for CSRF token for additional protection if using useSecureCookies
        // NB: The `__Host-` prefix is stricter than the `__Secure-` prefix.
        name: `${useSecureCookies ? '__Host-' : ''}next-auth.csrf-token`,
        options: {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          secure: useSecureCookies
        }
      },
      // Allow user cookie options to override any cookie settings above
      ...userOptions.cookies
    }

    // Session options
    const sessionOptions = {
      jwt: false,
      maxAge: 30 * 24 * 60 * 60, // Sessions expire after 30 days of being idle
      updateAge: 24 * 60 * 60, // Sessions updated only if session is greater than this value (0 = always, 24*60*60 = every 24 hours)
      ...userOptions.session
    }

    // JWT options
    const jwtOptions = {
      secret, // Use application secret if no keys specified
      maxAge: sessionOptions.maxAge, // maxAge is dereived from session maxAge,
      encode: jwt.encode,
      decode: jwt.decode,
      ...userOptions.jwt
    }

    // If no adapter specified, force use of JSON Web Tokens (stateless)
    if (!adapter) {
      sessionOptions.jwt = true
    }

    // Event messages
    const eventsOptions = {
      ...events,
      ...userOptions.events
    }

    // Callback functions
    const callbacksOptions = {
      ...defaultCallbacks,
      ...userOptions.callbacks
    }

    // Ensure CSRF Token cookie is set for any subsequent requests.
    // Used as part of the strateigy for mitigation for CSRF tokens.
    //
    // Creates a cookie like 'next-auth.csrf-token' with the value 'token|hash',
    // where 'token' is the CSRF token and 'hash' is a hash made of the token and
    // the secret, and the two values are joined by a pipe '|'. By storing the
    // value and the hash of the value (with the secret used as a salt) we can
    // verify the cookie was set by the server and not by a malicous attacker.
    //
    // For more details, see the following OWASP links:
    // https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html#double-submit-cookie
    // https://owasp.org/www-chapter-london/assets/slides/David_Johansson-Double_Defeat_of_Double-Submit_Cookie.pdf
    let csrfToken
    let csrfTokenVerified = false
    if (req.cookies[cookies.csrfToken.name]) {
      const [csrfTokenValue, csrfTokenHash] = req.cookies[cookies.csrfToken.name].split('|')
      if (csrfTokenHash === createHash('sha256').update(`${csrfTokenValue}${secret}`).digest('hex')) {
        // If hash matches then we trust the CSRF token value
        csrfToken = csrfTokenValue

        // If this is a POST request and the CSRF Token in the Post request matches
        // the cookie we have already verified is one we have set, then token is verified!
        if (req.method === 'POST' && csrfToken === csrfTokenFromPost) { csrfTokenVerified = true }
      }
    }
    if (!csrfToken) {
      // If no csrfToken - because it's not been set yet, or because the hash doesn't match
      // (e.g. because it's been modifed or because the secret has changed) create a new token.
      csrfToken = randomBytes(32).toString('hex')
      const newCsrfTokenCookie = `${csrfToken}|${createHash('sha256').update(`${csrfToken}${secret}`).digest('hex')}`
      cookie.set(res, cookies.csrfToken.name, newCsrfTokenCookie, cookies.csrfToken.options)
    }

    // User provided options are overriden by other options,
    // except for the options with special handling above
    const options = {
      debug: false,
      pages: {},
      // Custom options override defaults
      ...userOptions,
      // These computed settings can values in userSuppliedOptions but override them
      // and are request-specific.
      adapter,
      baseUrl,
      basePath,
      action,
      provider,
      cookies,
      secret,
      csrfToken,
      providers: parseProviders({ providers: userOptions.providers, baseUrl, basePath }),
      session: sessionOptions,
      jwt: jwtOptions,
      events: eventsOptions,
      callbacks: callbacksOptions
    }
    req.options = options

    // If debug enabled, set ENV VAR so that logger logs debug messages
    if (options.debug) {
      process.env._NEXTAUTH_DEBUG = true
    }

    // Get / Set callback URL based on query param / cookie + validation
    const callbackUrl = await callbackUrlHandler(req, res)

    if (req.method === 'GET') {
      switch (action) {
        case 'providers':
          providers(req, res)
          break
        case 'session':
          session(req, res)
          break
        case 'csrf':
          res.json({ csrfToken })
          return res.end()
        case 'signin':
          if (options.pages.signIn) {
            let redirectUrl = `${options.pages.signIn}${options.pages.signIn.includes('?') ? '&' : '?'}callbackUrl=${callbackUrl}`
            if (req.query.error) { redirectUrl = `${redirectUrl}&error=${req.query.error}` }
            return res.redirect(redirectUrl)
          }

          renderPage(req, res, 'signin', { providers: Object.values(options.providers), callbackUrl, csrfToken })
          break
        case 'signout':
          if (options.pages.signOut) {
            return res.redirect(`${options.pages.signOut}${options.pages.signOut.includes('?') ? '&' : '?'}error=${error}`)
          }

          renderPage(req, res, 'signout', { csrfToken, callbackUrl })
          break
        case 'callback':
          if (provider && options.providers[provider]) {
            callback(req, res)
          } else {
            res.status(400)
            return res.end(`Error: HTTP GET is not supported for ${url}`)
          }
          break
        case 'verify-request':
          if (options.pages.verifyRequest) { return res.redirect(options.pages.verifyRequest) }

          renderPage(req, res, 'verify-request')
          break
        case 'error':
          if (options.pages.error) { return res.redirect(`${options.pages.error}${options.pages.error.includes('?') ? '&' : '?'}error=${error}`) }

          renderPage(req, res, 'error', { error })
          break
        default:
          res.status(404)
          return res.end()
      }
    } else if (req.method === 'POST') {
      switch (action) {
        case 'signin':
          // Verified CSRF Token required for all sign in routes
          if (!csrfTokenVerified) {
            return res.redirect(`${baseUrl}${basePath}/signin?csrf=true`)
          }

          if (provider && options.providers[provider]) {
            signin(req, res)
          }
          break
        case 'signout':
          // Verified CSRF Token required for signout
          if (!csrfTokenVerified) {
            return res.redirect(`${baseUrl}${basePath}/signout?csrf=true`)
          }

          signout(req, res)
          break
        case 'callback':
          if (provider && options.providers[provider]) {
            // Verified CSRF Token required for credentials providers only
            if (options.providers[provider].type === 'credentials' && !csrfTokenVerified) {
              return res.redirect(`${baseUrl}${basePath}/signin?csrf=true`)
            }

            callback(req, res)
          } else {
            res.status(400)
            return res.end(`Error: HTTP POST is not supported for ${url}`)
          }
          break
        default:
          res.status(400)
          return res.end(`Error: HTTP POST is not supported for ${url}`)
      }
    } else {
      res.status(400)
      return res.end(`Error: HTTP ${req.method} is not supported for ${url}`)
    }
  })
}

/** Tha main entry point to next-auth */
export default function NextAuth (...args) {
  if (args.length === 1) {
    return (req, res) => NextAuthHandler(req, res, args[0])
  }

  return NextAuthHandler(...args)
}
