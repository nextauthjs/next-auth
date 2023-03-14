import type { AstroIntegration } from "astro"
import { dirname, join } from "path"
import type { PluginOption } from "vite"
import type { AstroAuthConfig } from "../server"

export default (config: AstroAuthConfig): AstroIntegration => ({
  name: "astro-auth",
  hooks: {
    "astro:config:setup": ({
      config: astroConfig,
      injectRoute,
      injectScript,
      updateConfig,
    }) => {
      if (astroConfig.output === "static")
        throw new Error(
          'auth-astro requires server-side rendering. Please set output to "server" & install an adapter. See https://docs.astro.build/en/guides/deploy/#adding-an-adapter-for-ssr'
        )

      updateConfig({
        vite: {
          plugins: [virtualModulePlugin(config)],
        },
      })

      config.prefix ??= "/api/auth"

      if (config.injectEndpoints !== false) {
        const currentDir = dirname(import.meta.url)
        injectRoute({
          pattern: config.prefix + "/[...astroAuth]",
          entryPoint: join(currentDir + "/api/[...astroAuth].ts"),
        })
      }

      const edge = ["@astrojs/vercel/edge", "@astrojs/cloudflare"].includes(
        astroConfig.adapter?.name!
      )

      if (!edge && globalThis.process && process.versions.node < "19.0.0") {
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

const virtualModulePlugin = (config: AstroAuthConfig): PluginOption => {
  const virtualModuleId = "auth:config"
  const resolvedId = "\0" + virtualModuleId

  return {
    name: "auth-astro-config",
    resolveId: (id) => {
      if (id === virtualModuleId) return resolvedId
    },
    load: (id) => {
      if (id === resolvedId) return `export default ${JSON.stringify(config)}`
    },
  }
}
