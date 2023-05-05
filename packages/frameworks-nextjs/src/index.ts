/**
 *
 * :::warning Note
 * This is the documentation for `next-auth@5`, which is currently **experimental**. For the documentation of the latest stable version, see [next-auth@4](https://next-auth.js.org).
 * :::
 *
 * If you are looking for the migration guide, visit the [`next-auth@5` Migration Guide](https://nextjs.authjs.dev/v5).
 *
 * ## Installation
 *
 * ```bash npm2yarn2pnpm
 * npm install next-auth@5 @auth/core
 * ```
 *
 * ## Signing in and signing out
 *
 * The App Router embraces Server Actions that can be leveraged to decrease the amount of JavaScript sent to the browser.
 *
 * :::info
 * [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions) is **in alpha stage**. In the future, NextAuth.js will integrate with Server Actions and provide first-party APIs.
 * Until then, here is how you can use NextAuth.js to log in and log out without JavaScript.
 * :::
 *
 * ```ts title="app/auth-components.tsx"
 * import { auth } from "../auth"
 * import { cookies, headers } from "next/headers"
 *
 * function CSRF() {
 *   const value = cookies().get("next-auth.csrf-token")?.value.split("|")[0]
 *   return <input type="hidden" name="csrfToken" value={value} />
 * }
 *
 * export function SignIn({ provider, ...props }: any) {
 *   return (
 *     <form action={`/api/auth/signin/${provider}`} method="post">
 *       <button {{...props}}/>
 *       <CSRF/>
 *     </form>
 *   )
 * }
 *
 * export function SignOut(props: any) {
 *   return (
 *     <form action="/api/auth/signout" method="post">
 *       <button {...props}/>
 *       <CSRF/>
 *     </form>
 *   )
 * }
 * ```
 *
 * Alternatively, you can create client components, using the `signIn()` and `signOut` methods:
 *
 * ```ts title="app/auth-components.tsx"
 * "use client"
 * import { signIn, signOut } from "next-auth/react"
 *
 * export function SignIn({provider, ...props}: any) {
 *   return <button {...props} onClick={() => signIn(provider)}/>
 * }
 *
 * export function SignOut(props: any) {
 *   return <button {...props} onClick={() => signOut()}/>
 * }
 * ```
 *
 * Then, you could for example use it like this:
 *
 * ```ts title=app/page.tsx
 * import { headers } from "next/headers"
 * import { SignIn, SignOut } from "./auth-components"
 *
 * export default async function Page() {
 *   const session = await auth(headers())
 *   if (session) {
 *     return (
 *       <>
 *         <pre>{JSON.stringify(session, null, 2)}</pre>
 *         <SignOut>Sign out</SignOut>
 *       </>
 *     )
 *   }
 *   return <SignIn id="github">Sign in with github</SignIn>
 * }
 * ```
 *
 * @module index
 */

import { Auth } from "@auth/core"
import { setEnvDefaults } from "./lib/env.js"
import { initAuth } from "./lib/index.js"

import type { NextRequest } from "next/server"
import type { NextAuthConfig } from "./lib/index.js"
import { getServerSession } from "./next"

type AppRouteHandlers = Record<
  "GET" | "POST",
  (req: NextRequest) => Promise<Response>
>

export type { NextAuthConfig }

/**
 * The result of invoking {@link NextAuth}, initialized with the {@link NextAuthConfig}.
 * It contains methods to set up and interact with NextAuth.js in your Next.js app.
 */
export interface NextAuthResult {
  /**
   * The NextAuth.js [Route Handler](https://beta.nextjs.org/docs/routing/route-handlers) methods. After initializing NextAuth.js in `auth.ts`,
   * export these methods from `app/api/auth/[...nextauth]/route.ts`.
   *
   * :::note
   * This is a workaround until we have integrated with [Next.js Server Actions](https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions).
   * :::
   *
   * @example
   * ```ts title="app/api/auth/[...nextauth]/route.ts"
   * import { handlers } from "../../../../auth"
   * export const { GET, POST } = handlers
   * export const runtime = "edge"
   * ```
   */
  handlers: AppRouteHandlers
  /**
   * A universal method to interact with NextAuth.js in your Next.js app.
   * After initializing NextAuth.js in `auth.ts`, use this method in Middleware, Route Handlers or React Server Components.
   *
   * @example
   * ```ts title="middleware.ts"
   * export { auth as middleware } from "./auth"
   * ```
   * @example
   * ```ts title="app/page.ts"
   * import { auth } from "../auth"
   * import { headers } from "next/headers"
   * export default async function Page() {
   *   const { token } = await auth(headers())
   *   return <div>Hello {token?.name}</div>
   * }
   * ```
   * @example
   * ```ts title="app/api/route.ts"
   * import { auth } from "../../auth"
   *
   * export const POST = auth((req) => {
   *   // req.auth
   * })
   * ```
   */
  auth: ReturnType<typeof initAuth>
  /** TODO: document */
  getServerSession: ReturnType<typeof getServerSession>
}

/**
 *  Initialize NextAuth.js.
 *
 *  @example
 * ```ts title="auth.ts"
 * import NextAuth from "next-auth"
 * import GitHub from "@auth/core/providers/github"
 *
 * export const { handlers, auth } = NextAuth({ providers: [GitHub] })
 * ```
 */
export default function NextAuth(config: NextAuthConfig): NextAuthResult {
  setEnvDefaults(config)
  const httpHandler = (req: NextRequest) => Auth(req, config)
  return {
    handlers: { GET: httpHandler, POST: httpHandler } as const,
    auth: initAuth(config),
    getServerSession: getServerSession(config),
  }
}
