// @ts-check
const path = require("path")

/** @type {import("eslint").ESLint.ConfigData} */
module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  extends: ["standard-with-typescript", "prettier"],
  rules: {
    camelcase: "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/restrict-template-expressions": "off",
  },
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: [
          path.resolve(__dirname, "./packages/**/tsconfig.eslint.json"),
          path.resolve(__dirname, "./packages/frameworks/**/tsconfig.json"),
          path.resolve(__dirname, "./apps/**/tsconfig.json"),
        ],
      },
    },
    {
      files: ["*.test.ts", "*.test.js"],
      env: { jest: true },
    },
    {
      files: ["docs"],
      plugins: ["@docusaurus"],
      extends: ["plugin:@docusaurus/recommended"],
    },
  ],
  plugins: ["jest"],
  ignorePatterns: [
    "**/dist/**",
    "**/node_modules/**",
    ".eslintrc.js",
    "**/.turbo/**",
    "**/coverage/**",
    "**/build/**",
  ],
}
