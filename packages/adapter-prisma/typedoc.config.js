export default {
  entryPoints: ["src/index.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryModule: "@auth/prisma-adapter",
  entryFileName: "../prisma-adapter.mdx",
  includeVersion: true,
  readme: 'none',
};
