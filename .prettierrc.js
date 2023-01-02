// @ts-check

/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: false,
  overrides: [
    {
      files: [
        "apps/dev/pages/api/auth/[...nextauth].ts",
        "docs/{sidebars,docusaurus.config}.js",
        "packages/core/src/index.ts",
      ],
      options: { printWidth: 150 },
    },
    {
      files: ["**/*package.json"],
      options: {
        trailingComma: "none",
      },
    },
  ],
}
