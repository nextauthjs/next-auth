// @ts-check

/** @type {Partial<(import("typedoc-plugin-markdown").PluginOptions | import("typedoc").TypeDocOptions) & {id: string}>} */
const typedocConfig = {
  watch: !!process.env.TYPEDOC_WATCH,
  plugin: [require.resolve("./typedoc-mdn-links")],
  cleanOutputDir: true,
  disableSources: true,
  excludeExternals: true,
  excludeGroups: true,
  excludeInternal: true,
  excludeNotDocumented: true,
  excludePrivate: true,
  excludeProtected: true,
  gitRevision: "main",
  hideBreadcrumbs: true,
  hideGenerator: true,
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
  outputFileStrategy: "modules",
  readme: "none",
  skipErrorChecking: true,
  sort: ["kind", "static-first", "required-first", "alphabetical"],
}

/**
 * @param {string} name
 * @returns {[string, import("@docusaurus/types").PluginOptions]}
 */
module.exports.typedocAdapter = (name) => {
  const id = name.toLowerCase().replace(" ", "-")

  /** @type {typeof typedocConfig} */
  const options = {
    ...typedocConfig,
    id,
    entryPoints: [`../packages/adapter-${id}/src/index.ts`],
    tsconfig: `../packages/adapter-${id}/tsconfig.json`,
    out: `docs/reference/adapter/${id}`,
  }
  return ["docusaurus-plugin-typedoc", options]
}

/**
 * @param {string} pkgDir
 * @param {string[]} entrypoints
 * @returns {[string, import("@docusaurus/types").PluginOptions]}
 */
module.exports.typedocFramework = (pkgDir, entrypoints) => {
  const id = pkgDir.replace("frameworks-", "")
  /** @type {typeof typedocConfig} */
  const options = {
    ...typedocConfig,
    id,
    entryPoints: entrypoints.map((e) => `../packages/${pkgDir}/src/${e}`),
    tsconfig: `../packages/${pkgDir}/tsconfig.json`,
    out: `docs/reference/${id === "next-auth" ? "nextjs" : id}`,
  }
  return ["docusaurus-plugin-typedoc", options]
}
