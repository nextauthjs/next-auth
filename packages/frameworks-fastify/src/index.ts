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
 * import GitHub from "@auth/fastify/providers/github"
 * import Fastify from "fastify"
 *
 * // If app is served through a proxy, trust the proxy to allow HTTPS protocol to be detected
 * const fastify = Fastify({ trustProxy: true });
 *
 * fastify.register(FastifyAuth({ providers: [ GitHub ] }), { prefix: '/auth' })
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
 * [origin]/auth/callback/[provider]
 * ```
 *
 * ## Signing in and signing out
 * Once your application is mounted you can sign in or out by making requests to the following [REST API endpoints](https://authjs.dev/reference/core/types#authaction) from your client-side code.
 * NB: Make sure to include the `csrfToken` in the request body for all sign-in and sign-out requests.
 *
 * ## Managing the session
 * If you are using Fastify with a template engine (e.g @fastify/view with EJS, Pug), you can make the session data available to all routes via a preHandler hook as follows
 *
 * ```ts title="app.ts"
 * import { getSession } from "@auth/fastify"
 * 
 * // Decorating the reply is not required but will optimise performance
 * // Only decorate the reply with a value type like null, as reference types like objects are shared among all requests, creating a security risk.
 * fastify.decorateReply('session', null)

 * export async function authSession(req: FastifyRequest, reply: FastifyReply) {
 *   reply.session = await getSession(req, authConfig)
 * }
 *
 * fastify.addHook("preHandler", authSession)
 *
 * // Now in your route
 * fastify.get("/", (req, reply) => {
 *   const session = reply.session;
 *   reply.view("index.pug", { user: session?.user })
 * })
 * ```
 * 
 * Note for TypeScript, you may want to augment the Fastify types to include the `session` property on the reply object. This can be done by creating a @types/fastify/index.d.ts file:
 * 
 * ```ts title="@types/fastify/index.d.ts"
 * import { Session } from "@auth/core/types";
 * declare module "fastify" {
 *   interface FastifyReply {
 *     session: Session | null;
 *   }
 * }
 * ```
 * 
 * You may need to add `"typeRoots": ["@types"]` to `compilerOptions` in your tsconfig.json.
 *
 * ## Authorization
 * You can protect routes with hooks by checking for the presence of a session and then redirect to a login page if the session is not present.
 *
 * ```ts
 * export async function authenticatedUser(
 *   req: FastifyRequest,
 *   reply: FastifyReply
 * ) {
 *   reply.session ??= await getSession(req, authConfig);
 *   if (!reply.session?.user) {
 *     reply.redirect("/auth/signin?error=SessionRequired");
 *   }
 * }
 * ```
 *
 * ### Per Route
 * To protect a single route, simply register the preHandler hook to the route as follows:
 * ```ts title="app.ts"
 * // This route is protected
 * fastify.get("/profile", { preHandler: [authenticatedUser] }, (req, reply) => {
 *   const session = reply.session;
 *   reply.view("profile.pug", { user: session?.user })
 * });
 * 
 * // This route is not protected
 * fastify.get("/", (req, reply) => {
 *   reply.view("index");
 * });
 * ```
 * 
 * ### Per Group of Routes
 * To protect a group of routes, create a plugin and register the authenication hook and routes to the instance as follows:
 *
 * ```ts title="app.ts"
 * fastify.register(
 *   async (instance) => {
 *     // All routes on this instance will be protected because of the preHandler hook
 *     instance.addHook("preHandler", authenticatedUser)
 * 
 *     instance.get("/", (req, reply) => {
 *       reply.view("protected.pug")
 *     })
 *     
 *     instance.get("/me", (req, reply) => {
 *       reply.send(reply.session?.user)
 *     })
 *   },
 *   { prefix: "/protected" }
 * )
 * ```
 *
 * @module @auth/fastify
 */

import { Auth, setEnvDefaults, createActionURL } from "@auth/core"
import type { AuthConfig, Session } from "@auth/core/types"
import type { FastifyRequest, FastifyPluginAsync } from "fastify"
import formbody from "@fastify/formbody"
import { toWebRequest, toFastifyReply } from "./lib/index.js"

export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "@auth/core/types"

export function FastifyAuth(
  config: Omit<AuthConfig, "raw">
): FastifyPluginAsync {
  setEnvDefaults(process.env, config)
  return async (fastify) => {
    if (!fastify.hasContentTypeParser("application/x-www-form-urlencoded")) {
      fastify.register(formbody)
    }
    fastify.route({
      method: ["GET", "POST"],
      url: "/*",
      handler: async (request, reply) => {
        config.basePath = getBasePath(request)
        const response = await Auth(toWebRequest(request), config)
        return toFastifyReply(response, reply)
      },
    })
  }
}

export type GetSessionResult = Promise<Session | null>

export async function getSession(
  req: FastifyRequest,
  config: Omit<AuthConfig, "raw">
): GetSessionResult {
  setEnvDefaults(process.env, config)
  const url = createActionURL(
    "session",
    req.protocol,
    // @ts-expect-error headers type is not compatible
    new Headers(req.headers),
    process.env,
    config
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

function getBasePath(req: FastifyRequest) {
  return req.routeOptions.config.url.split("/*")[0]
}
