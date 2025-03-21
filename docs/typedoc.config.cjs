// @ts-check

const fs = require("node:fs")
const path = require("node:path")

const isSkipAdapters = process.env.TYPEDOC_SKIP_ADAPTERS ? "skip" : "adapter-"
const excludePackages = new RegExp(
  `(core|next-auth|frameworks-(?!template)|${isSkipAdapters})`
)

const entryPoints = fs
  .readdirSync(path.resolve(__dirname, "../packages"))
  .filter((dir) => excludePackages.test(dir))
  .map((dir) => `../packages/${dir}`)

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions}
 */
module.exports = {
  // typedoc options
  entryPoints,
  entryPointStrategy: "packages",
  out: "pages/reference",
  tsconfig: "./tsconfig.json",
  plugin: [
    "typedoc-plugin-markdown",
    require.resolve("./typedoc-nextauth.js"),
    "typedoc-plugin-mdn-links",
    "typedoc-plugin-no-inherit",
  ],
  disableSources: true,
  excludeNotDocumented: true,
  excludeExternals: true,
  excludeInternal: true,
  excludeProtected: true,
  excludeReferences: true,
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
  useCodeBlocks: true,
}
