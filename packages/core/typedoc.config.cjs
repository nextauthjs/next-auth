// @ts-check
const fs = require("node:fs")
const path = require("node:path")

const providers = fs
  .readdirSync(path.join(__dirname, "src", "providers"))
  .filter((file) => file.endsWith(".ts") && !file.startsWith("oauth"))
  .map((p) => `src/providers/${p}`)

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions}
 */
module.exports = {
  entryPoints: ["src/index.ts", "src/adapters.ts", "src/errors.ts", "src/jwt.ts", "src/types.ts"].concat(providers),
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryFileName: "../core.mdx",
  entryModule: "@auth/core",
  includeVersion: true,  
  readme:'none',
}
