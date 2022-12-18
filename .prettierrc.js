// @ts-check

/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: false,
  overrides: [
    {
      files: "apps/dev/pages/api/auth/[...nextauth].ts",
      options: {
        printWidth: 150,
      },
    },
    {
      files: "packages/core/src/**/*.ts",
      excludeFiles: "packages/core/src/providers/oauth-types.ts",
      options: {
        // Re-enable, but jsdocLineWrappingStyle is a bit greedy:
        // https://github.com/hosseinmd/prettier-plugin-jsdoc#options
        // plugins: ["prettier-plugin-jsdoc"],
      },
    },
  ],
}
