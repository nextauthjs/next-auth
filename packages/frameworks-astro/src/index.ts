/**
 *
 * :::warning
 * `@auth/astro` is currently experimental. The API _will_ change in the future.
 * :::
 *
 * `@auth/astro` is the official Astro integration for Auth.js.
 * It provides a simple way to add authentication to your Astro app in a few lines of code.
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm run astro add @auth/astro
 * ```
 *
 * ### Manual installation
 *
 * Install the required dependencies.
 *
 * ```bash npm2yarn
 * npm i @auth/astro
 * ```
 *
 * Add the `@auth/astro` integration to your Astro config.
 *
 * ```ts
 * // astro.config.mjs
 * import { defineConfig } from 'astro/config';
 * import auth from '@auth/astro';
 *
 * export default defineConfig({
 *   // ...
 *   integrations: [auth()]
 * })
 * ```
 *
 * ## Configure
 *
 * Create your auth config file `auth.config.ts`.
 *
 * ```ts
 * import { defineConfig } from '@auth/astro/config'
 * import GitHub from '@auth/astro/providers/github'
 *
 * export default defineConfig({
 *   providers: [
 *     GitHub({
 *       clientId: import.meta.env.GITHUB_CLIENT_ID,
 *       clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
 *     }),
 *   ]
 * })
 * ```
 *
 * ## Get the current session
 *
 * You can access the current session from [`Astro.locals`](https://docs.astro.build/en/reference/api-reference/#astrolocals) (or [`context.locals`](https://docs.astro.build/en/reference/api-reference/#contextlocals) in an endpoint).
 *
 * ```tsx
 * ---
 * const { session } = Astro.locals
 * ---
 *
 * {JSON.stringify(session)}
 * ```
 *
 * ## Protected routes
 *
 * ```tsx
 * ---
 * import Layout from '~/layouts/Base.astro'
 *
 * if (!Astro.locals.session) return Astro.redirect('/')
 * ---
 *
 * <Layout>
 *   <h1>Welcome {Astro.locals.session.user.name}</h1>
 * </Layout>
 * ```
 *
 * @module @auth/astro
 */

import type { AuthConfig } from "@auth/core"
import type { AstroIntegration } from "astro"
import type { PluginOption } from "vite"
import { dirname, join } from "node:path"

export interface AstroAuthConfig extends Omit<AuthConfig, "raw"> {
  /**
   * Defineds wether or not you want the integration to handle the API routes
   * @default true
   */
  injectEndpoints?: boolean
  /**
   * Path to the config file
   */
  configFile?: string
}

export const virtualConfigModule = ({
  configFile,
  basePath,
}: AstroAuthConfig): PluginOption => {
  const virtualModuleId = "auth:config"
  const resolvedId = "\0" + virtualModuleId

  const virtualClientModuleId = "auth:config/client"
  const resolvedClientId = "\0" + virtualClientModuleId

  return {
    name: "auth-astro-config",
    resolveId: (id) => {
      if (id === virtualModuleId) return resolvedId
      if (id === virtualClientModuleId) return resolvedClientId
    },
    load: (id) => {
      if (id === resolvedId)
        return `
          import authConfig from "${configFile}";
          
          export default (ctx) => {
            let resolvedConfig = typeof authConfig === 'function' ? authConfig(ctx) : authConfig
            resolvedConfig.basePath = '${basePath}';

            return resolvedConfig;
          }
        `
      if (id === resolvedClientId)
        return `export default { basePath: '${basePath}' }`
    },
  }
}

/**
 * The Astro integration to add auth.js to your project.
 */
export default (
  config: AstroAuthConfig = { providers: [] }
): AstroIntegration => ({
  name: "astro-auth",
  hooks: {
    "astro:config:setup": async ({
      config: astroConfig,
      injectRoute,
      injectScript,
      updateConfig,
      addMiddleware,
      logger,
    }) => {
      if (astroConfig.output === "static")
        throw new Error(
          'auth-astro requires server-side rendering. Please set output to "server" & install an adapter. See https://docs.astro.build/en/guides/deploy/#adding-an-adapter-for-ssr'
        )

      config.basePath ??= "/auth"
      config.configFile ??= "./auth.config"

      updateConfig({
        vite: {
          plugins: [virtualConfigModule(config)],
          optimizeDeps: { exclude: ["auth:config"] },
        },
      })

      addMiddleware({
        entrypoint: "@auth/astro/middleware",
        order: "pre",
      })

      if (config.injectEndpoints !== false) {
        const currentDir = dirname(import.meta.url.replace("file://", ""))
        const entrypoint = join(currentDir, "./api/[...auth].js")
        injectRoute({
          pattern: config.basePath + "/[...auth]",
          entrypoint,
        })
      }

      if (!astroConfig.adapter) {
        logger.error(
          "No Adapter found, please make sure you provide one in your Astro config"
        )
      }
      const edge = ["@astrojs/vercel/edge", "@astrojs/cloudflare"].includes(
        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain -- ignore
        astroConfig.adapter?.name!
      )

      if (
        (!edge && globalThis.process && process.versions.node < "19.0.0") ||
        (process.env.NODE_ENV === "development" && edge)
      ) {
        injectScript(
          "page-ssr",
          `import crypto from "node:crypto";
if (!globalThis.crypto) globalThis.crypto = crypto;
if (typeof globalThis.crypto.subtle === "undefined") globalThis.crypto.subtle = crypto.webcrypto.subtle;
if (typeof globalThis.crypto.randomUUID === "undefined") globalThis.crypto.randomUUID = crypto.randomUUID;
`
        )
      }
    },
  },
})
