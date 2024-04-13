// @ts-check

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').MarkdownTheme}
 */
module.exports = {
  entryPoints: ["src/index.ts", "src/adapters.ts", "src/lib/index.ts", "src/lib/http-api-adapters.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryModule: "@auth/express",
  entryFileName: "../express.mdx",
  includeVersion: true,
  readme: 'none',
}
