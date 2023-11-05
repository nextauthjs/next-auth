import type { PluginOptions } from "docusaurus-plugin-typedoc"
import type { TypeDocOptions } from "typedoc"

type TypeDocConfig = Partial<
  (PluginOptions | TypeDocOptions) & {
    id: string
  }
>

const defaultConfig = {
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
} satisfies TypeDocConfig

export function typedocAdapter(name: string) {
  const id = name.toLowerCase().replace(" ", "-")
  const options = {
    ...defaultConfig,
    id,
    entryPoints: [`../packages/adapter-${id}/src/index.ts`],
    tsconfig: `../packages/adapter-${id}/tsconfig.json`,
    out: `docs/reference/adapter/${id}`,
  } satisfies TypeDocConfig
  return ["docusaurus-plugin-typedoc", options]
}

export function typedocFramework(pkgDir: string, entrypoints: string[]) {
  const id = pkgDir.replace("frameworks-", "")
  const folderId = id === "next-auth" ? "nextjs" : id
  const options = {
    ...defaultConfig,
    id,
    entryPoints: entrypoints.map((e) => `../packages/${pkgDir}/src/${e}`),
    tsconfig: `../packages/${pkgDir}/tsconfig.json`,
    out: `docs/reference/${folderId}`,
    sidebar: {
      filteredIds: [
        `reference/${folderId}`,
        `reference/${folderId}/index`,
        `reference/${folderId}/module.index`,
      ],
    },
  } satisfies TypeDocConfig
  return ["docusaurus-plugin-typedoc", options]
}
