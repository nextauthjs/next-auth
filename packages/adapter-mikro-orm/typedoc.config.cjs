// @ts-check

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').MarkdownTheme}
 */
module.exports = {
  entryPoints: ["src/index.ts", "src/lib/entities.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryModule: "@auth/mikro-orm-adapter",
  entryFileName: "../mikro-orm-adapter.mdx",
  includeVersion: true,
  readme: 'none',
}
