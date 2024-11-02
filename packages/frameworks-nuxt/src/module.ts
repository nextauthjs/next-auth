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
 * Use runtime configuration to set auth related secrets. These will be automatically repalced by the runtime values,
 * if your environemnt has variables like NUXT_AUTH_SECRET, NUXT_AUTH_GITHUB_CLIENT_ID, NUXT_AUTH_GITHUB_CLIENT_SECRET.
 *
 * ```ts title="nuxt.config.ts"
 * export default defineNuxtConfig({
 *  modules: ["@auth/nuxt"],
 *
 *  // module options
 *  authJs: {
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
 * To configure the providers, you need to set up the handler in a file in the `server/routes/auth` directory.
 * Use runtime configuration to set the client ID and client secret, and also the AuthJS secret.
 *
 * ```ts title="src/server/routes/auth/[...].ts"
 *
 * import { NuxtAuthHandler } from "#auth"
 * import GitHub from "@auth/nuxt/providers/github"
 *
 * const runtimeConfig = useRuntimeConfig()
 * const authConfig: NuxtAuthConfig = {
 *     secret: runtimeConfig.auth.secret,
 *     GitHub({
 *      clientId: runtimeConfig.auth.github.clientId,
 *      clientSecret: runtimeConfig.auth.github.clientSecret,
 *  }),
 * }
 *
 * export default NuxtAuthHandler(authConfig)
 * ```
 * ## Signing in and signing out
 *
 * This module provides a composable `useAuth` to work with the module functionality, like do client-side sign-in and sign-out actions.
 *
 * ```ts title="src/pages/index.vue"
 *    <script setup lang="ts">
 *    const { signIn, signOut, session, user, status } = useAuth()
 *    </script>
 *
 *    <template>
 *      <div>
 *        <div v-if="status === 'loading'">Loading...</div>
 *        <div v-else-if="status === 'authenticated'">
 *          <p>Welcome, {{ user?.name }}</p>
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
 *  - Use the `auth-logged-in` middelware with `definePageMeta()` at a given page:
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
 *    You can use arbitrary logic to determine which pages should be exempt from the middleware.
 *    ```ts title="nuxt.config.ts"
 *    hooks: {
 *      "pages:extend"(pages) {
 *        function setMiddleware(pages: NuxtPage[]) {
 *          for (const page of pages) {
 *            // Add middleware to all pages except the root and guest pages
 *            if (!["/", "/guest"].includes(page.path)) {
 *              page.meta ||= {}
 *              page.meta.middleware = page.meta.middleware ?? []
 *              page.meta?.middleware.push("auth-logged-in")
 *            }
 *             if (page.children) {
 *              setMiddleware(page.children)
 *            }
 *          }
 *        }
 *         setMiddleware(pages)
 *      },
 *    },
 *   ```
 *
 *  - Use the `auth-logged-out` middelware with `definePageMeta()` at a given page:
 *    Optionally set a redirect location for authenticated users.
 *    ```ts title="src/pages/guest.ts
 *       definePageMeta({
 *         middleware: ["auth-logged-out"],
 *         auth: {
 *           authenticatedRedirectTo: "/protected",
 *         },
 *       })
 *    ```
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

const configKey = "authJs" as const

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

    // Make configuration available at runtime
    nuxt.options.runtimeConfig[configKey] = defu(
      nuxt.options.runtimeConfig[configKey] || {},
      options
    )

    nuxt.options.runtimeConfig.public[configKey] = defu(
      nuxt.options.runtimeConfig.public[configKey] || {},
      {
        basePath: options.basePath,
        globalUnauthenticatedRedirectTo:
          options.middleware?.globalUnauthenticatedRedirectTo,
      }
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
  interface RuntimeConfig {
    authJs: NuxtAuthConfig
  }

  interface PublicRuntimeConfig {
    authJs: {
      basePath: string
      globalUnauthenticatedRedirectTo: string
    }
  }
}

declare module "#app" {
  interface PageMeta {
    auth?: {
      unauthenticatedRedirectTo?: string
      authenticatedRedirectTo?: string
    }
  }
}
