/**
 * ## Signing in and signing out
 *
 *
 * The App Router embraces Server Actions that can be leveraged to decrease the amount of JavaScript sent to the browser.
 *
 * :::info
 * Next.js Server Actions is **under development**. In the future, Next.js Auth will integrate with Server Actions and provide first-party APIs.
 * The below is a workaround until then.
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
 * import { signIn, signOut } from "@auth/nextjs/client"
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

type AppRouteHandlers = Record<
  "GET" | "POST",
  (req: NextRequest) => Promise<Response>
>

export type { NextAuthConfig }

/**
 * The result of invoking {@link NextAuth}, initialized with the {@link NextAuthConfig}.
 * It contains methods to set up and interact with Next.js Auth in your Next.js app.
 */
export interface NextAuthResult {
  /**
   * The Next.js Auth [Route Handler](https://beta.nextjs.org/docs/routing/route-handlers) methods. After initializing Next.js Auth in `auth.ts`,
   * export these methods from `app/api/auth/[...nextauth]/route.ts`.
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
   * A universal method to interact with Next.js Auth in your Next.js app.
   * After initializing Next.js Auth in `auth.ts`, use this method in Middleware, Route Handlers and React Server Components.
   *
   * @example
   * ```ts
   * // middleware.ts
   * // This will also make sure that the session expiry is rotated.
   * export { auth as middleware } from "./auth"
   *
   * // app/page.ts
   * import { auth } from "auth"
   * import { headers } from "next/headers"
   * export default async function Page() {
   *   const { token } = await auth(headers())
   *   return <div>Hello {token?.name}</div>
   * }
   * ```
   */
  auth: ReturnType<typeof initAuth>
}

/**
 *  Initialize Next.js Auth.
 *
 *  @example
 * ```ts title="auth.ts"
 * import { NextAuth } from "@auth/nextjs"
 * import GitHub from "@auth/core/providers/github"
 *
 * export const { handlers, auth } = NextAuth({ providers: [GitHub] })
 * ```
 */
export function NextAuth(config: NextAuthConfig): NextAuthResult {
  setEnvDefaults(config)
  const httpHandler = (req: NextRequest) => Auth(req, config)
  return {
    handlers: { GET: httpHandler, POST: httpHandler } as const,
    auth: initAuth(config),
  }
}
