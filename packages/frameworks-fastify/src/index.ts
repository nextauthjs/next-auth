/**
 *
 * :::warning
 * `@auth/fastify` is currently experimental. The API _will_ change in the future.
 * :::
 *
 * Fastify Auth is the official Fastify integration for Auth.js.
 * It provides a simple way to add authentication to your Fastify app in a few lines of code.
 *
 * ## Installation
 * ```bash npm2yarn
 * npm install @auth/fastify
 * ```
 *
 * ## Usage
 *
 * ```ts title="src/routes/auth.route.ts"
 * import { FastifyAuth } from "@auth/fastify"
 * import formbodyParser from "@fastify/formbody"
 * import httpProxy from "@fastify/http-proxy"
 * import GitHub from "@auth/fastify/providers/github"
 * import Fastify from "fastify"
 *
 * const fastify = Fastify();
 *
 * // Make sure to use a form body parser so Auth.js can receive data from the client
 * fastify.register(formbodyParser)
 *
 * // If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected
 * fastify.register(httpProxy, {
 *   upstream: 'https://my-api.example.com',
 *   http2: false, // Set to true if your upstream supports http2
 * });
 *
 * fastify.register(
 *   FastifyAuth({
 *     providers: [
 *       GitHub({
 *         clientId: process.env.GITHUB_ID,
 *         clientSecret: process.env.GITHUB_SECRET,
 *       }),
 *     ],
 *   }),
 *   { prefix: '/api/auth' }
 * )
 * ```
 *
 * Don't forget to set the `AUTH_SECRET` environment variable. This should be a minimum of 32 characters, random string. On UNIX systems you can use `openssl rand -hex 32` or check out `https://generate-secret.vercel.app/32`.
 *
 * You will also need to load the environment variables into your runtime environment. For example in Node.js with a package like [`dotenv`](https://www.npmjs.com/package/dotenv) or `Deno.env` in Deno.
 *
 * ### Provider Configuration
 * The callback URL used by the [providers](https://authjs.dev/reference/core/modules/providers) must be set to the following, unless you mount the `FastifyAuth` handler on a different path:
 *
 * ```
 * [origin]/api/auth/callback/[provider]
 * ```
 *
 * ## Signing in and signing out
 * Once your application is mounted you can sign in or out by making requests to the following [REST API endpoints](https://authjs.dev/reference/core/types#authaction) from your client-side code.
 * NB: Make sure to include the `csrfToken` in the request body for all sign-in and sign-out requests.
 *
 * ## Managing the session
 * If you are using Fastify with a template engine (e.g EJS, Pug), you can make the session data available to all routes via middleware as follows
 *
 * ```ts title="app.ts"
 * import { getSession } from "@auth/fastify"
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
 * export function authenticatedUser(
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
 * @module @auth/fastify
 */

import { Auth } from "@auth/core"
import type { AuthConfig, Session } from "@auth/core/types"
import type { FastifyRequest, FastifyPluginAsync } from 'fastify'
import { toWebRequest, toFastifyReply } from "./lib/index.js"

export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "@auth/core/types"

function FastifyAuthPlugin(authConfig: Omit<AuthConfig, "raw">): FastifyPluginAsync {
  return async (fastify, opts) => {
    fastify.route({
      method: ['GET', 'POST'],
      url: '/*',
      handler: async (request, reply) => {
        const response = await Auth(toWebRequest(request), authConfig);
        return toFastifyReply(response, reply);
      }
    });
  };
}

export function FastifyAuth(
  config: AuthConfig
): ReturnType<typeof FastifyAuthPlugin> {
  const { ...authOptions } = config
  authOptions.secret ??= process.env.AUTH_SECRET
  authOptions.redirectProxyUrl ??= process.env.AUTH_REDIRECT_PROXY_URL
  authOptions.trustHost ??= !!(
    process.env.AUTH_TRUST_HOST ??
    process.env.VERCEL ??
    process.env.NODE_ENV !== "production"
  )

  return FastifyAuthPlugin(authOptions)
}

export type GetSessionResult = Promise<Session | null>

export async function getSession(
  req: FastifyRequest,
  options: Omit<AuthConfig, "raw">
): GetSessionResult {
  options.secret ??= process.env.AUTH_SECRET
  options.trustHost ??= true

  const request = toWebRequest(req)
  const url = new URL("/api/auth/session", request.url)

  const response = await Auth(
    new Request(url, { headers: request.headers }),
    options
  )

  const { status = 200 } = response
  
  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}
