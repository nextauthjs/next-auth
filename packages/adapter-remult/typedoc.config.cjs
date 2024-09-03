// @ts-check

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').MarkdownTheme}
 */
module.exports = {
  entryPoints: ["src/index.ts", "src/lib/mysql.ts", "src/lib/pg.ts", "src/lib/sqlite.ts", "src/lib/utils.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryModule: "@auth/remult-adapter",
  entryFileName: "../remult-adapter.mdx",
  includeVersion: true,
  readme: 'none',
}
