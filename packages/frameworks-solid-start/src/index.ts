/**
 *
 * :::warning
 * `@auth/solid-start` is currently experimental. The API _will_ change in the future.
 * :::
 *
 * SolidStart Auth is the official SolidStart integration for Auth.js.
 * It provides a simple way to add authentication to your SolidStart app in a few lines of code.
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/core @auth/solid-start
 * ```
 *
 * @module @auth/solid-start
 */

import { Auth, type AuthConfig } from "@auth/core"
import type { AuthAction, Session } from "@auth/core/types"

export { AuthError, CredentialsSignin } from "@auth/core/errors"
export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "@auth/core/types"

export interface SolidAuthConfig extends AuthConfig {
  /**
   * Defines the base path for the auth routes.
   * @default '/api/auth'
   */
  prefix?: string
}

const actions: AuthAction[] = [
  "providers",
  "session",
  "csrf",
  "signin",
  "signout",
  "callback",
  "verify-request",
  "error",
]

function SolidAuthHandler(prefix: string, authOptions: SolidAuthConfig) {
  return async (event: any) => {
    const { request } = event
    const url = new URL(request.url)
    const action = url.pathname
      .slice(prefix.length + 1)
      .split("/")[0] as AuthAction

    if (!actions.includes(action) || !url.pathname.startsWith(prefix + "/")) {
      return
    }

    return await Auth(request, authOptions)
  }
}

/**
 * ## Setup
 *
 * [Generate an auth secret](https://generate-secret.vercel.app/32), then set it as an environment variable:
 *
 * ```
 * AUTH_SECRET=your_auth_secret
 * ```
 *
 * ## Creating the API handler
 *
 * This example uses github, make sure to set the following environment variables:
 *
 * ```
 * GITHUB_ID=your_github_oauth_id
 * GITHUB_SECRET=your_github_oauth_secret
 * ```
 *
 * ```ts
 * // routes/api/auth/[...solidauth].ts
 * import { SolidAuth, type SolidAuthConfig } from "@auth/solid-start"
 * import GitHub from "@auth/core/providers/github"
 *
 * export const authOpts: SolidAuthConfig = {
 *   providers: [
 *     GitHub({
 *       clientId: process.env.GITHUB_ID,
 *       clientSecret: process.env.GITHUB_SECRET,
 *     }),
 *   ],
 *   debug: false,
 * }
 *
 * export const { GET, POST } = SolidAuth(authOpts)
 * ```
 *
 * ## Getting the current session
 *
 * ```ts
 * import { getSession } from "@auth/solid-start"
 * import { createServerData$ } from "solid-start/server"
 * import { authOpts } from "~/routes/api/auth/[...solidauth]"
 *
 * export const useSession = () => {
 *   return createServerData$(
 *     async (_, { request }) => {
 *       return await getSession(request, authOpts)
 *     },
 *     { key: () => ["auth_user"] }
 *   )
 * }
 *
 * // useSession returns a resource:
 * const session = useSession()
 * const loading = session.loading
 * const user = () => session()?.user
 * ```
 * ## Protected Routes
 *
 * ### When Using SSR
 *
 * When using SSR, it is recommended to create a `Protected` component that will trigger suspense using the `Show` component. It should look like this:
 *
 *
 * ```tsx
 * // components/Protected.tsx
 * import { type Session } from "@auth/core/types";
 * import { getSession } from "@auth/solid-start";
 * import { Component, Show } from "solid-js";
 * import { useRouteData } from "solid-start";
 * import { createServerData$, redirect } from "solid-start/server";
 * import { authOpts } from "~/routes/api/auth/[...solidauth]";
 *
 * const Protected = (Comp: IProtectedComponent) => {
 *   const routeData = () => {
 *     return createServerData$(
 *       async (_, event) => {
 *         const session = await getSession(event.request, authOpts);
 *         if (!session || !session.user) {
 *           throw redirect("/");
 *         }
 *         return session;
 *       },
 *       { key: () => ["auth_user"] }
 *     );
 *   };
 *
 *   return {
 *     routeData,
 *     Page: () => {
 *       const session = useRouteData<typeof routeData>();
 *       return (
 *         <Show when={session()} keyed>
 *           {(sess) => <Comp {...sess} />}
 *         </Show>
 *       );
 *     },
 *   };
 * };
 *
 * type IProtectedComponent = Component<Session>;
 *
 * export default Protected;
 * ```
 *
 * It can be used like this:
 *
 *
 * ```tsx
 * // routes/protected.tsx
 * import Protected from "~/components/Protected";
 *
 * export const { routeData, Page } = Protected((session) => {
 *   return (
 *     <main class="flex flex-col gap-2 items-center">
 *       <h1>This is a protected route</h1>
 *     </main>
 *   );
 * });
 *
 * export default Page;
 * ```
 *
 * ### When Using CSR
 *
 * When using CSR, the `Protected` component will not work as expected and will cause the screen to flash. To fix this, a Solid-Start middleware is used:
 *
 * ```tsx
 * // entry-server.tsx
 * import { Session } from "@auth/core";
 * import { getSession } from "@auth/solid-start";
 * import { redirect } from "solid-start";
 * import {
 *   StartServer,
 *   createHandler,
 *   renderAsync,
 * } from "solid-start/entry-server";
 * import { authOpts } from "./routes/api/auth/[...solidauth]";
 *
 * const protectedPaths = ["/protected"]; // add any route you wish in here
 *
 * export default createHandler(
 *   ({ forward }) => {
 *     return async (event) => {
 *       if (protectedPaths.includes(new URL(event.request.url).pathname)) {
 *         const session = await getSession(event.request, authOpts);
 *         if (!session) {
 *           return redirect("/");
 *         }
 *       }
 *       return forward(event);
 *     };
 *   },
 *   renderAsync((event) => <StartServer event={event} />)
 * );
 * ```
 *
 * And now a protected route can be created:
 *
 *
 * ```tsx
 * // routes/protected.tsx
 * export default () => {
 *   return (
 *     <main class="flex flex-col gap-2 items-center">
 *       <h1>This is a protected route</h1>
 *     </main>
 *   );
 * };
 * ```
 *
 * :::note
 * The CSR method should also work when using SSR, the SSR method shouldn't work when using CSR
 * :::
 *
 */
export function SolidAuth(config: SolidAuthConfig) {
  const { prefix = "/api/auth", ...authOptions } = config
  authOptions.secret ??= process.env.AUTH_SECRET
  authOptions.trustHost ??= !!(
    process.env.AUTH_TRUST_HOST ??
    process.env.VERCEL ??
    process.env.NODE_ENV !== "production"
  )
  const handler = SolidAuthHandler(prefix, authOptions)
  return {
    async GET(event: any) {
      return await handler(event)
    },
    async POST(event: any) {
      return await handler(event)
    },
  }
}

export type GetSessionResult = Promise<Session | null>

export async function getSession(
  req: Request,
  options: Omit<AuthConfig, "raw">
): GetSessionResult {
  options.secret ??= process.env.AUTH_SECRET
  options.trustHost ??= true

  const url = new URL("/api/auth/session", req.url)
  const response = await Auth(
    new Request(url, { headers: req.headers }),
    options
  )

  const { status = 200 } = response

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}
