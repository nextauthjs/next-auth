export default {
  entryPoints: ["src/index.ts"],
  entryPointStrategy: "expand",
  tsconfig: "./tsconfig.json",
  entryModule: "@auth/prisma-adapter",
  includeVersion: true,
  readme: 'none',
};
