/* eslint-disable @typescript-eslint/restrict-template-expressions */
import * as jwt from "../jwt"
import parseUrl from "../lib/parse-url"
import logger, { setLogger } from "../lib/logger"
import * as cookie from "./lib/cookie"
import { defaultCallbacks } from "./lib/default-callbacks"
import parseProviders from "./lib/providers"
import * as routes from "./routes"
import renderPage from "./pages"
import createSecret from "./lib/create-secret"
import callbackUrlHandler from "./lib/callback-url-handler"
import extendRes from "./lib/extend-res"
import csrfTokenHandler from "./lib/csrf-token-handler"
import { eventsErrorHandler, adapterErrorHandler } from "../lib/errors"
import { NextApiRequest, NextApiResponse } from "../../types/internals/utils"
import { NextAuthOptions } from "../../types"

// To work properly in production with OAuth providers the NEXTAUTH_URL
// environment variable must be set.
if (!process.env.NEXTAUTH_URL) {
  logger.warn("NEXTAUTH_URL")
}

/**
 * @param {import("next").NextApiRequest} req
 * @param {import("next").NextApiResponse} res
 * @param {import("types").NextAuthOptions} userOptions
 */
async function NextAuthHandler(req, res, userOptions) {
  if (userOptions.logger) {
    setLogger(userOptions.logger)
  }
  // If debug enabled, set ENV VAR so that logger logs debug messages
  if (userOptions.debug) {
    ;(process.env._NEXTAUTH_DEBUG as any) = true
  }

  extendRes(req, res)

  if (!req.query.nextauth) {
    const message =
      "Cannot find [...nextauth].js in pages/api/auth. Make sure the filename is written correctly."

    logger.error("MISSING_NEXTAUTH_API_ROUTE_ERROR", new Error(message))
    return res.status(500).end(`Error: ${message}`)
  }

  const {
    nextauth,
    action = nextauth[0],
    providerId = nextauth[1],
    error = nextauth[1],
  } = req.query

  delete req.query.nextauth

  // @todo refactor all existing references to baseUrl and basePath
  const { basePath, baseUrl } = parseUrl(
    process.env.NEXTAUTH_URL ?? (process.env.VERCEL_URL as any)
  )

  const cookies = {
    ...cookie.defaultCookies(
      userOptions.useSecureCookies || baseUrl.startsWith("https://")
    ),
    // Allow user cookie options to override any cookie settings above
    ...userOptions.cookies,
  }

  const secret = createSecret({ userOptions, basePath, baseUrl })

  const providers = parseProviders({
    providers: userOptions.providers,
    baseUrl,
    basePath,
  })

  const provider = providers.find(({ id }) => id === providerId)

  // Checks only work on OAuth 2.x + OIDC providers
  if (
    provider?.type === "oauth" &&
    !provider.version?.startsWith("1.") &&
    !provider.checks
  ) {
    provider.checks = ["state"]
  }

  const maxAge = 30 * 24 * 60 * 60 // Sessions expire after 30 days of being idle by default

  // User provided options are overriden by other options,
  // except for the options with special handling above
  /** @type {import("types/internals").InternalOptions} */
  const options = {
    debug: false,
    pages: {},
    theme: "auto",
    // Custom options override defaults
    ...userOptions,
    // These computed settings can have values in userOptions but we override them
    // and are request-specific.
    baseUrl,
    basePath,
    action,
    provider,
    cookies,
    secret,
    providers,
    // Session options
    session: {
      jwt: !userOptions.adapter, // If no adapter specified, force use of JSON Web Tokens (stateless)
      maxAge,
      updateAge: 24 * 60 * 60,
      ...userOptions.session,
    },
    // JWT options
    jwt: {
      secret, // Use application secret if no keys specified
      maxAge, // same as session maxAge,
      encode: jwt.encode,
      decode: jwt.decode,
      ...userOptions.jwt,
    },
    // Event messages
    events: eventsErrorHandler(userOptions.events ?? {}, logger),
    adapter: adapterErrorHandler(userOptions.adapter, logger),
    // Callback functions
    callbacks: {
      ...defaultCallbacks,
      ...userOptions.callbacks,
    },
    logger,
  }

  req.options = options

  csrfTokenHandler(req, res)
  await callbackUrlHandler(req, res)

  const render = renderPage(req, res)
  const { pages } = req.options

  if (req.method === "GET") {
    switch (action) {
      case "providers":
        return routes.providers(req, res)
      case "session":
        return await routes.session(req, res)
      case "csrf":
        return res.json({ csrfToken: req.options.csrfToken })
      case "signin":
        if (pages.signIn) {
          let signinUrl = `${pages.signIn}${
            pages.signIn.includes("?") ? "&" : "?"
          }callbackUrl=${req.options.callbackUrl}`
          if (error) {
            signinUrl = `${signinUrl}&error=${error}`
          }
          return res.redirect(signinUrl)
        }

        return render.signin()
      case "signout":
        if (pages.signOut) return res.redirect(pages.signOut)

        return render.signout()
      case "callback":
        if (provider) {
          return await routes.callback(req, res)
        }
        break
      case "verify-request":
        if (pages.verifyRequest) {
          return res.redirect(pages.verifyRequest)
        }
        return render.verifyRequest()
      case "error":
        if (pages.error) {
          return res.redirect(
            `${pages.error}${
              pages.error.includes("?") ? "&" : "?"
            }error=${error}`
          )
        }

        // These error messages are displayed in line on the sign in page
        if (
          [
            "Signin",
            "OAuthSignin",
            "OAuthCallback",
            "OAuthCreateAccount",
            "EmailCreateAccount",
            "Callback",
            "OAuthAccountNotLinked",
            "EmailSignin",
            "CredentialsSignin",
            "SessionRequired",
          ].includes(error)
        ) {
          return res.redirect(`${baseUrl}${basePath}/signin?error=${error}`)
        }

        return render.error({ error })
      default:
    }
  } else if (req.method === "POST") {
    switch (action) {
      case "signin":
        // Verified CSRF Token required for all sign in routes
        if (req.options.csrfTokenVerified && provider) {
          return await routes.signin(req, res)
        }

        return res.redirect(`${baseUrl}${basePath}/signin?csrf=true`)
      case "signout":
        // Verified CSRF Token required for signout
        if (req.options.csrfTokenVerified) {
          return await routes.signout(req, res)
        }
        return res.redirect(`${baseUrl}${basePath}/signout?csrf=true`)
      case "callback":
        if (provider) {
          // Verified CSRF Token required for credentials providers only
          if (
            provider.type === "credentials" &&
            !req.options.csrfTokenVerified
          ) {
            return res.redirect(`${baseUrl}${basePath}/signin?csrf=true`)
          }

          return await routes.callback(req, res)
        }
        break
      case "_log":
        if (userOptions.logger) {
          try {
            const { code, level, ...metadata } = req.body
            logger[level](code, metadata)
          } catch (error) {
            // If logging itself failed...
            logger.error("LOGGER_ERROR", error)
          }
        }
        return res.end()
      default:
    }
  }
  return res
    .status(400)
    .end(`Error: HTTP ${req.method} is not supported for ${req.url}`)
}

/** Tha main entry point to next-auth */
export default function NextAuth(
  ...args:
    | [NextApiRequest, NextApiResponse, NextAuthOptions]
    | [NextAuthOptions]
) {
  if (args.length === 1) {
    return async (req, res) => await NextAuthHandler(req, res, args[0])
  }

  return NextAuthHandler(...args)
}
