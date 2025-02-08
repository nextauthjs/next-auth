// @ts-check

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions}
 */
module.exports = {
  entryPoints: ["src/index.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  plugin: [
    require.resolve("./../../docs/typedoc-nextauth.js"),
    "typedoc-plugin-markdown",
  ],
  entryFileName: "../prisma-adapter.mdx",
  entryModule: "@auth/prisma-adapter",
  includeVersion: true,
  readme: 'none'
}
