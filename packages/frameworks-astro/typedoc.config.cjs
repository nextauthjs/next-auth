// @ts-check

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').MarkdownTheme}
 */
module.exports = {
  entryPoints: ["src/index.ts", "src/client.ts", "src/config.ts", "src/middleware.ts", "src/server.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryModule: "@auth/astro",
  entryFileName: "../astro.mdx",
  includeVersion: true,
  readme: 'none',
}
