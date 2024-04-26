// @ts-check

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').MarkdownTheme}
 */
module.exports = {
  entryPoints: ["src/index.ts", "src/entities.ts", "src/utils.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryModule: "@auth/typeorm-adapter",
  entryFileName: "../typeorm-adapter.mdx",
  includeVersion: true,
  readme: 'none',
}
