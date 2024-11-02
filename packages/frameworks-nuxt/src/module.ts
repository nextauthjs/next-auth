/**
 *
 * :::warning
 * `@auth/nuxt` is currently experimental. The API _will_ change in the future.
 * :::
 *
 * Nuxt Auth is the official Nuxt integration for Auth.js.
 * It provides a simple way to add authentication to your Nuxt app in a few lines of code.
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install @auth/nuxt
 * ```
 *
 * ## Usage
 *
 * Add `@auth/nuxt` to the `modules` section of `nuxt.config.ts`.
 * You can also set the `basePath` option to change the default path for the authentication routes.
 * Use runtime configuration to set auth related secrets. These will be automatically replaced by the runtime values,
 * if your environment has variables like `NUXT_AUTH_SECRET`, `NUXT_AUTH_GITHUB_CLIENT_ID`, `NUXT_AUTH_GITHUB_CLIENT_SECRET`.
 *
 * ```ts title="nuxt.config.ts"
 * export default defineNuxtConfig({
 *  modules: ["@auth/nuxt"],
 *
 *  // module options
 *  auth: {
 *    basePath: "/auth",
 *  },
 *
 *  runtimeConfig: {
 *    auth: {
 *      secret: "",
 *      github: {
 *        clientId: "",
 *        clientSecret: "",
 *      },
 *    },
 *  },
 * })
 * ```
 *
 * ## Provider Configuration
 *
 * To configure the providers, you need to set up the handler in a file in the `server/utils/auth.ts` (this will provide auto-import on the server side) and `server/routes/auth/[...].ts` files.
 * Use runtime configuration to set the client ID and client secret, and also the AuthJS secret.
 *
 * ```ts title="src/server/utils/auth.ts"
 *
 * import { NuxtAuth } from "#auth"
 * import type { AuthConfig } from "@auth/nuxt"
 * import type { H3Event } from "h3"
 * import GitHub from "@auth/nuxt/providers/github"
 *
 * const runtimeConfig = useRuntimeConfig()
 * export const authConfig: AuthConfig = {
 *     ...runtimeConfig.auth,
 *     secret: runtimeConfig.auth.secret,
 *     providers: [GitHub(runtimeConfig.auth.github)],
 * }
 *
 * const { handlers, auth: _auth } = NuxtAuth(authConfig)
 * export function authHandler() {
 *   return handlers
 * }
 *
 * // You can use this for getting session on the server side
 * export async function auth(event: H3Event) {
 *   return await _auth(event)
 * }
 * ```
 * ```ts title="src/server/routes/auth/[...].ts"
 * // no need even to import the authHandler, it will be auto-imported from the src/server/utils/auth.ts
 * export default authHandler()
 * ```
 * ## Signing in and signing out
 *
 * This module provides a composable `useAuth` to work with the module functionality, like do client-side sign-in and sign-out actions.
 *
 * ```ts title="src/pages/index.vue"
 *    <script setup lang="ts">
 *    const { signIn, signOut, session, auth } = useAuth()
 *    </script>
 *
 *    <template>
 *      <div>
 *        <div v-if="auth.loggedIn">
 *          <p>Welcome, {{ auth?.user?.name }}</p>
 *          <button @click="signOut">Sign out</button>
 *        </div>
 *        <div v-else>
 *          <button @click="signIn">Sign in</button>
 *        </div>
 *      </div>
 *    </template>
 * ```
 *
 * ## Managing the session
 * TODO:
 *
 * ## Authorization
 *
 * In @auth/nuxt there are a few ways you could protect routes from unauthenticated users.
 * The module provides two middlewares: `auth-logged-in` and `auth-logged-out`.
 *
 * There are 2 main scenarios:
 *
 * ### 1. No enforced authentication in pages, opt-in for authentication at certain pages
 *  - Use the `auth-logged-in` middelware with `definePageMeta()` at a given to-be-protected page:
 *    Optionally set a redirect location for unauthenticated users.
 *    @example
 *   ```ts title="src/pages/protected.vue"
 *      definePageMeta({
 *        middleware: ["auth-logged-in"],
 *        auth: {
 *          unauthenticatedRedirectTo: "/guest",
 *        },
 *      })
 *    ```
 *
 * ### 2. Require authentication for all pages, opt-out from authentication at certain pages
 *  - Load `auth-logged-in` middleware to all to-be-protected pages in `nuxt.config.ts` using 'pages-extend' hook.
 *    You can use arbitrary logic to determine which pages should be exempt from the middleware (in the below example the `/` and `/guest` routes are unprotected).
 *
 *   @example
 *    ```ts title="middleware/auth.global.ts"
 * export default defineNuxtRouteMiddleware((to, from) => {
 *  // root and guest pages are always accessible
 *  if (["/", "/guest"].includes(to.path)) {
 *    return
 *  }
 *
 *  // All other pages require authentication
 *  const { auth } = useAuth()
 *
 *  if (!auth.value.loggedIn) {
 *    if (import.meta.server) {
 *      return createError({
 *        statusCode: 401,
 *        message: "You must be logged in to access this page",
 *      })
 *    }
 *    return abortNavigation()
 *  }
 *})
 *   ```
 *
 * @module @auth/nuxt
 */

import {
  defineNuxtModule,
  addImports,
  addPlugin,
  addTypeTemplate,
  createResolver,
  addRouteMiddleware,
  useLogger,
} from "@nuxt/kit"
import { defu } from "defu"

const configKey = "auth" as const

// Re-export types of Auth.js
export type {
  Account,
  DefaultSession,
  Profile,
  Session,
  User,
} from "@auth/core/types"

export type { AuthConfig } from "@auth/core"

export interface MiddlewareConfig {
  globalUnauthenticatedRedirectTo?: string
}

/** Configure the {@link defineNuxtModule} method. */
export interface NuxtAuthConfig {
  basePath?: string
  middleware?: MiddlewareConfig
}

export default defineNuxtModule<NuxtAuthConfig>({
  meta: {
    name: "@auth/nuxt",
    configKey,
    // Compatibility constraints
    compatibility: {
      nuxt: "^3.9.0",
      bridge: false,
    },
  },

  // Default configuration options
  defaults: {
    basePath: "/auth",
    middleware: {
      globalUnauthenticatedRedirectTo: undefined,
    },
  },

  setup(options, nuxt) {
    const logger = useLogger("@authjs/nuxt")

    const { resolve } = createResolver(import.meta.url)

    // Make public configuration available at runtime
    nuxt.options.runtimeConfig.public[configKey] = defu(
      nuxt.options.runtimeConfig.public[configKey] || {},
      {
        basePath: options.basePath,
        middleware: {
          globalUnauthenticatedRedirectTo:
            options.middleware?.globalUnauthenticatedRedirectTo || undefined,
        },
      } as NuxtAuthConfig
    )

    // Add composables
    addImports([
      { name: "useAuth", from: resolve("./runtime/composables/useAuth") },
    ])

    // These will be available only in the /server directory
    nuxt.hook("nitro:config", (nitroConfig) => {
      nitroConfig.alias = nitroConfig.alias || {}
      nitroConfig.alias["#auth"] = resolve("./runtime/lib/server")
    })

    // These will be available outside of the /server directory
    nuxt.options.alias["#auth"] = resolve("./runtime/lib/client")

    // Add types
    addTypeTemplate({
      filename: "types/auth.d.ts",
      getContents: () =>
        [
          "declare module '#auth' {",
          `  const signIn: typeof import('${resolve(
            "./runtime/lib/client"
          )}').signIn`,
          `  const signOut: typeof import('${resolve(
            "./runtime/lib/client"
          )}').signOut`,
          `  const NuxtAuth: typeof import('${resolve(
            "./runtime/lib/server"
          )}').NuxtAuth`,
          "}",
        ].join("\n"),
    })

    addRouteMiddleware({
      name: "auth-logged-in",
      path: resolve("./runtime/middleware/auth-logged-in"),
    })
    addRouteMiddleware({
      name: "auth-logged-out",
      path: resolve("./runtime/middleware/auth-logged-out"),
    })

    // Do not add the extension since the `.ts` will be transpiled to `.mjs` after `npm run prepack`
    addPlugin(resolve("./runtime/plugin"))

    logger.info("Auth.js module has been initialized")
  },
})

// Ambient types
declare module "@nuxt/schema" {
  interface PublicRuntimeConfig {
    auth: NuxtAuthConfig
  }
}

declare module "vue-router" {
  interface RouteMeta {
    auth?: {
      unauthenticatedRedirectTo?: string
      authenticatedRedirectTo?: string
    }
  }
}
