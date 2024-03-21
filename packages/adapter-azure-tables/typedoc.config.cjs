// @ts-check

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').MarkdownTheme}
 */
module.exports = {
  entryPoints: ["src/index.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryModule: "@auth/azure-tables-adapter",
  entryFileName: "../azure-tables-adapter.mdx",
  includeVersion: true,
  readme: 'none',
}
