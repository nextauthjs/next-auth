// @ts-check

/**
 * @type {import('typedoc').TypeDocOptions & import('typedoc-plugin-markdown').PluginOptions}
 */
module.exports = {
  entryPoints: ["src/index.tsx", "src/adapters.ts", "src/middleware.ts", "src/jwt.ts", "src/next.ts", "src/react.tsx", "src/webauthn.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryModule: "next-auth",
  entryFileName: "../nextjs.mdx",
  includeVersion: true,
  readme: 'none'
}
