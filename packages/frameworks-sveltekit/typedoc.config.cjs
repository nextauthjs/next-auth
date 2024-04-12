// @ts-check

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').MarkdownTheme}
 */
module.exports = {
  entryPoints: ["src/lib/index.ts", "src/lib/env.ts", "src/lib/client.ts", "src/lib/adapter.ts", "src/lib/actions.ts", "src/lib/types.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryModule: "@auth/sveltekit",
  entryFileName: "../sveltekit.mdx",
  includeVersion: true,
  readme: 'none',
}
