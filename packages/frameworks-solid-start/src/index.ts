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
 * npm install @auth/solid-start
 * ```
 *
 * We recommended to using [create-jd-app](https://github.com/OrJDev/create-jd-app)
 *
 * @module @auth/solid-start
 */

import { Auth } from "@auth/core"
import type {
  AuthAction,
  AuthConfig as SolidAuthConfig,
  Session,
} from "@auth/core/types"
import { setEnvDefaults } from "./env.js"
import { auth, signIn, signOut } from "./actions.js"
import type { APIEvent } from "@solidjs/start/server"

export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "@auth/core/types"

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

// TODO: Double check
import { webcrypto } from "node:crypto"
globalThis.crypto ??= webcrypto as Crypto

function SolidAuthHandler(prefix: string, authOptions: SolidAuthConfig) {
  return async (event: APIEvent) => {
    const { request } = event
    console.log("SOLID.HANDLER.REQUEST", request)
    const url = new URL(request.url)
    console.log("SOLID.HANDLER.URL", url)
    const action = url.pathname
      .slice(prefix.length + 1)
      .split("/")[0] as AuthAction

    if (!actions.includes(action) || !url.pathname.startsWith(prefix + "/")) {
      return
    }

    const authResponse = await Auth(request, authOptions)
    console.log("SOLIDHANDLER.AUTHRESPONSE", authResponse)
    return authResponse
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
 * in this example we are using github so make sure to set the following environment variables:
 *
 * ```
 * AUTH_GITHUB_ID=your_github_oauth_id
 * AUTH_GITHUB_SECRET=your_github_oauth_secret
 * ```
 *
 * ```ts title="/routes/api/auth/[...solidauth].ts"
 * import { SolidAuth, type SolidAuthConfig } from "@auth/solid-start"
 * import GitHub from "@auth/solid-start/providers/github"
 *
 * export const authOpts: SolidAuthConfig = {
 *   debug: false,
 *   providers: [
 *     GitHub({
 *       clientId: process.env.AUTH_GITHUB_ID,
 *       clientSecret: process.env.AUTH_GITHUB_SECRET,
 *     }),
 *   ],
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
 * When using SSR, I recommend creating a `Protected` component that will trigger suspense using the `Show` component. It should look like this:
 *
 *
 * ```tsx title="/components/Protected.tsx"
 * import { type Session } from "@auth/solid-start";
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
 * ```tsx title="/routes/protected.tsx"
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
 * When using CSR, the `Protected` component will not work as expected and will cause the screen to flash, so I had to come up with a tricky solution, we will use a Solid-Start middleware:
 *
 * ```tsx title="entry-server.tsx
 * import { getSession, type Session } from "@auth/solid-start";
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
 * And now you can easily create a protected route:
 *
 *
 * ```tsx title="/routes/protected.tsx"
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

const authorizationParamsPrefix = "authorizationParams-"

export function SolidAuth(
  config: SolidAuthConfig | ((request: Request) => PromiseLike<SolidAuthConfig>)
) {
  return {
    signIn: async (event: APIEvent) => {
      console.log("signin.event", event)
      const { request } = event
      const _config =
        typeof config === "object" ? config : await config(event.request)
      setEnvDefaults(_config)
      const formData = await request.formData()
      const { providerId: provider, ...options } = Object.fromEntries(formData)

      // get the authorization params from the options prefixed with `authorizationParams-`
      let authorizationParams: Parameters<typeof signIn>[2] = {}
      let _options: Parameters<typeof signIn>[1] = {}
      for (const key in options) {
        if (key.startsWith(authorizationParamsPrefix)) {
          authorizationParams[key.slice(authorizationParamsPrefix.length)] =
            options[key] as string
        } else {
          _options[key] = options[key]
        }
      }
      await signIn(
        provider as string,
        _options,
        authorizationParams,
        _config,
        event
      )
    },
    signOut: async (event: APIEvent) => {
      console.log("signout.event", event)
      const _config =
        typeof config === "object" ? config : await config(event.request)
      setEnvDefaults(_config)
      const options = Object.fromEntries(await event.request.formData())
      await signOut(options, _config, event)
    },
    handlers: async () => {
      return {
        async GET(event: APIEvent) {
          const _config =
            typeof config === "object" ? config : await config(event.request)
          setEnvDefaults(_config)

          // event.locals.auth = auth(event, _config)
          // event.locals.getSession = auth(event, _config)

          const handler = SolidAuthHandler("/auth", _config)
          console.log("HANDLERS.SOLIDCONFIG.GET", _config)
          return await handler(event)
        },
        async POST(event: APIEvent) {
          const _config =
            typeof config === "object" ? config : await config(event.request)
          setEnvDefaults(_config)

          // event.locals.auth ??= () => auth(event, _config)
          // event.locals.getSession = auth(event, _config)

          const handler = SolidAuthHandler("/auth", _config)
          console.log("HANDLERS.SOLIDCONFIG.POST", _config)
          return await handler(event)
        },
      }
    },
  }
}

export type GetSessionResult = Promise<Session | null>

// export async function getSession(
//   req: Request,
//   options: Omit<AuthConfig, "raw">
// ): GetSessionResult {
//   options.secret ??= process.env.AUTH_SECRET
//   options.trustHost ??= true
//
//   console.log("getSession.options", options)
//
//   const url = new URL(`${options.basePath}/session`, req.url)
//   const response = await Auth(
//     new Request(url, { headers: req.headers }),
//     options
//   )
//
//   const { status = 200 } = response
//
//   const data = await response.json()
//
//   if (!data || !Object.keys(data).length) return null
//   if (status === 200) return data
//   throw new Error(data.message)
// }
