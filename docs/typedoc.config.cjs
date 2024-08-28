// @ts-check

const fs = require("node:fs")
const path = require("node:path")

const frameworks = fs
  .readdirSync(path.resolve(__dirname, "../packages"))
  .filter((dir) => dir.startsWith("frameworks-"))
  .filter((dir) => dir !== "frameworks-template")
  .map((dir) => `../packages/${dir}`)

frameworks.push("../packages/next-auth", "../packages/core")

const adapters = process.env.TYPEDOC_SKIP_ADAPTERS
  ? []
  : fs
      .readdirSync(path.resolve(__dirname, "../packages"))
      .filter((dir) => dir.startsWith("adapter-"))
      .map((dir) => `../packages/${dir}`)

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions}
 */
module.exports = {
  // typedoc options
  entryPoints: [...frameworks, ...adapters],
  entryPointStrategy: "packages",
  out: "pages/reference",
  tsconfig: "./tsconfig.json",
  plugin: [
    "typedoc-plugin-markdown",
    require.resolve("./typedoc-nextauth.cjs"),
    "typedoc-plugin-mdn-links",
  ],
  disableSources: true,
  excludeNotDocumented: true,
  excludeExternals: true,
  excludeInternal: true,
  excludePrivate: true,
  excludeProtected: true,
  cleanOutputDir: false,
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
  name: "API Reference",

  // typedoc-plugin-markdown options
  outputFileStrategy: "modules",
  entryFileName: "overview.mdx",
  fileExtension: ".mdx",
  excludeScopesInPaths: true,
  hidePageHeader: true,
  hideBreadcrumbs: true,
  excludeGroups: true,
  expandObjects: true,
  parametersFormat: "table",
  indexFormat: "table",
  textContentMappings: {
    "label.packages": "Integrations",
  },
  useCodeBlocks: true,
}
