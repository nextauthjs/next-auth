// @ts-check
const fs = require("node:fs")
const path = require("node:path")

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions}
 */
module.exports = {
  entryPoints: ["src/index.tsx", "src/adapters.ts", "src/middleware.ts", "src/jwt.ts", "src/next.ts", "src/react.tsx", "webauthn.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryModule: "next-auth",
  entryFileName: "../next-auth.mdx",
  includeVersion: true,
  readme: 'none'
}
