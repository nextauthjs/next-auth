// @ts-check

import type { PluginOptions } from "docusaurus-plugin-typedoc"
import type { TypeDocOptions } from "typedoc"

import manifest from "./manifest.mjs"

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
  useCodeBlocks: true,
  expandObjects: true,
} satisfies TypeDocConfig

export function typedocAdapter({ id }: (typeof manifest.adapters)[number]) {
  const options = {
    ...defaultConfig,
    id,
    entryPoints: [`../packages/adapter-${id}/src/index.ts`],
    entryModule: id,
    tsconfig: `../packages/adapter-${id}/tsconfig.json`,
    out: `docs/reference/adapter/${id}`,
  } satisfies TypeDocConfig
  return ["docusaurus-plugin-typedoc", options]
}

export function typedocFramework({
  packageDir,
  entrypoints,
  id,
}: (typeof manifest.frameworks)[number]) {
  const packageName = require(`../packages/${packageDir}/package.json`).name
  const options = {
    ...defaultConfig,
    id,
    entryPoints: entrypoints.map((e) => `../packages/${packageDir}/src/${e}`),
    entryModule: packageName,
    tsconfig: `../packages/${packageDir}/tsconfig.json`,
    out: `docs/reference/${id}`,
  } satisfies TypeDocConfig
  return ["docusaurus-plugin-typedoc", options]
}
