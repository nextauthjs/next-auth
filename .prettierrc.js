// @ts-check

/** @type {import("prettier").Config} */
module.exports = {
  semi: false,
  singleQuote: false,
  overrides: [
    {
      files: [
        "apps/dev/nextjs/pages/api/auth-old/[...nextauth].ts",
        "apps/dev/nextjs/app/api/auth/[...nextauth]/route.ts",
        "docs/{sidebars,docusaurus.config}.js",
        "packages/frameworks-nextjs/src/lib/env.ts",
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
