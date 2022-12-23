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
      ],
      options: { printWidth: 150 },
    },
  ],
}
