/**
 *
 * :::warning
 * `@auth/express` is currently experimental. The API _will_ change in the future.
 * :::
 *
 * Express Auth is the official Express integration for Auth.js.
 * It provides a simple way to add authentication to your Express app in a few lines of code.
 *
 * ## Installation
 * ```bash npm2yarn
 * npm install @auth/express
 * ```
 *
 * ## Usage
 *
 * ```ts title="src/routes/auth.route.ts"
 * import { ExpressAuth } from "@auth/express"
 * import GitHub from "@auth/express/providers/github"
 * import express from "express"
 *
 * const app = express()
 *
 * // If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected
 * // https://expressjs.com/en/guide/behind-proxies.html
 * app.set('trust proxy', true)
 * app.use("/auth/*", ExpressAuth({ providers: [ GitHub ] }))
 * ```
 *
 * Don't forget to set the `AUTH_SECRET` environment variable. This should be a minimum of 32 characters, random string. On UNIX systems you can use `openssl rand -hex 32` or check out `https://generate-secret.vercel.app/32`.
 *
 * You will also need to load the environment variables into your runtime environment. For example in Node.js with a package like [`dotenv`](https://www.npmjs.com/package/dotenv) or `Deno.env` in Deno.
 *
 * ### Provider Configuration
 * The callback URL used by the [providers](https://authjs.dev/reference/core/providers) must be set to the following, unless you mount the `ExpressAuth` handler on a different path:
 *
 * ```
 * [origin]/auth/callback/[provider]
 * ```
 *
 * ## Signing in and signing out
 * Once your application is mounted you can sign in or out by making requests to the following [REST API endpoints](https://authjs.dev/reference/core/types#authaction) from your client-side code.
 * NB: Make sure to include the `csrfToken` in the request body for all sign-in and sign-out requests.
 *
 * ## Managing the session
 * If you are using Express with a template engine (e.g EJS, Pug), you can make the session data available to all routes via middleware as follows
 *
 * ```ts title="app.ts"
 * import { getSession } from "@auth/express"
 *
 * export function authSession(req: Request, res: Response, next: NextFunction) {
 *   res.locals.session = await getSession(req)
 *   next()
 * }
 *
 * app.use(authSession)
 *
 * // Now in your route
 * app.get("/", (req, res) => {
 *   const { session } = res.locals
 *   res.render("index", { user: session?.user })
 * })
 * ```
 *
 * ## Authorization
 * You can protect routes by checking for the presence of a session and then redirect to a login page if the session is not present.
 * This can either be done per route, or for a group of routes using a middleware such as the following:
 *
 * ```ts
 * export async function authenticatedUser(
 *   req: Request,
 *   res: Response,
 *   next: NextFunction
 * ) {
 *   const session = res.locals.session ?? (await getSession(req, authConfig))
 *   if (!session?.user) {
 *     res.redirect("/login")
 *   } else {
 *     next()
 *   }
 * }
 * ```
 *
 * ### Per Route
 * To protect a single route, simply add the middleware to the route as follows:
 * ```ts title="app.ts"
 * // This route is protected
 * app.get("/profile", authenticatedUser, (req, res) => {
 *   const { session } = res.locals
 *   res.render("profile", { user: session?.user })
 * })
 *
 * // This route is not protected
 * app.get("/", (req, res) => {
 *   res.render("index")
 * })
 *
 * app.use("/", root)
 * ```
 * ### Per Group of Routes
 * To protect a group of routes, define a router and add the middleware to the router as follows:
 *
 * ```ts title="routes/protected.route.ts"
 * import { Router } from "express"
 *
 * const router = Router()
 *
 * router.use(authenticatedUser) // All routes defined after this will be protected
 *
 * router.get("/", (req, res) => {
 *   res.render("protected")
 * })
 *
 * export default router
 * ```
 *
 * Then we mount the router as follows:
 * ```ts title="app.ts"
 * import protected from "./routes/protected.route"
 *
 * app.use("/protected", protected)
 * ```
 *
 * @module @auth/express
 */

import {
  Auth,
  type AuthConfig,
  setEnvDefaults,
  createActionURL,
} from "@auth/core"
import type { Session } from "@auth/core/types"
import * as e from "express"
import { toWebRequest, toExpressResponse } from "./lib/index.js"

export { AuthError, CredentialsSignin } from "@auth/core/errors"
export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "@auth/core/types"

export function ExpressAuth(config: Omit<AuthConfig, "raw">) {
  return async (req: e.Request, res: e.Response, next: e.NextFunction) => {
    e.json()(req, res, async (err) => {
      if (err) return next(err)
      e.urlencoded({ extended: true })(req, res, async (err) => {
        if (err) return next(err)
        try {
          config.basePath = getBasePath(req)
          setEnvDefaults(process.env, config)
          await toExpressResponse(await Auth(toWebRequest(req), config), res)
          if (!res.headersSent) next()
        } catch (error) {
          next(error)
        }
      })
    })
  }
}

export type GetSessionResult = Promise<Session | null>

export async function getSession(
  req: e.Request,
  config: Omit<AuthConfig, "raw">
): GetSessionResult {
  setEnvDefaults(process.env, config)
  const url = createActionURL(
    "session",
    req.protocol,
    // @ts-expect-error
    new Headers(req.headers),
    process.env,
    config.basePath
  )

  const response = await Auth(
    new Request(url, { headers: { cookie: req.headers.cookie ?? "" } }),
    config
  )

  const { status = 200 } = response

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}

function getBasePath(req: e.Request) {
  return req.baseUrl.split(req.params[0])[0].replace(/\/$/, "")
}
