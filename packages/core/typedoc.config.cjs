// @ts-check
const fs = require("node:fs")
const path = require("node:path")

const providers = fs
  .readdirSync(path.join(__dirname, "src", "providers"))
  .filter((file) => file.endsWith(".ts") && !file.startsWith("oauth"))
  .map((p) => `src/providers/${p}`)

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').MarkdownTheme}
 */
module.exports = {
  entryPoints: ["src/index.ts", "src/adapters.ts", "src/errors.ts", "src/jwt.ts", "src/types.ts"].concat(providers),
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  plugin: [
    "typedoc-plugin-markdown",
    require.resolve("./../../docs/typedoc-nextauth.cjs"),
    require.resolve("./../../docs/typedoc-mdn-links.cjs"),
  ],
  hideInPageTOC: true,
  disableSources: true,
  hideBreadcrumbs: true,
  excludeNotDocumented: true,
  excludeExternals: true,
  excludeInternal: true,
  excludePrivate: true,
  excludeProtected: true,
  cleanOutputDir: true,
  gitRevision: "main",
  githubPages: false,
  hideGenerator: true,
  readme: "none",
  sort: ["kind", "static-first", "required-first", "alphabetical"],
  kindSortOrder: [
    "Function",
    "TypeAlias",
    "Interface",
    "Reference",
    "Project",
    "Module",
    "Namespace",
    "Class",
    "Constructor",
    "Property",
    "Variable",
    "Accessor",
    "Method",
    "Parameter",
    "TypeParameter",
    "TypeLiteral",
    "CallSignature",
    "ConstructorSignature",
    "IndexSignature",
    "GetSignature",
    "SetSignature",
  ],
  theme: "nextauth",

  outputFileStrategy: "modules",
  entryModule: "@auth/core",
  entryFileName: "src/index.ts",
  excludeGroups: true,
  hidePageHeader: true,
  useCodeBlocks: false,
  expandObjects: true,
  publicPath: "/reference/core",
}
