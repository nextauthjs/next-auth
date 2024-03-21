// @ts-check

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').MarkdownTheme}
 */
module.exports = {
  entryPoints: ["src/index.ts", "src/lib/client.ts", "src/lib/utils.ts", "src/lib/graphql/fragments.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryModule: "@auth/dgraph-adapter",
  entryFileName: "../dgraph-adapter.mdx",
  includeVersion: true,
  readme: 'none',
}
