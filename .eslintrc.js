// @ts-check

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
  parserOptions: {
    project: ["./packages/**/tsconfig.json"],
  },
  overrides: [
    {
      files: ["*.test.ts", "*.test.js"],
      env: { jest: true },
    },
    {
      files: ["docs/**"],
      plugins: ["@docusaurus"],
      extends: ["plugin:@docusaurus/recommended"],
    },
    {
      files: ["packages/core/src/**/*"],
      plugins: ["jsdoc"],
      extends: ["plugin:jsdoc/recommended"],
      rules: {
        "jsdoc/require-param": "off",
        "jsdoc/require-returns": "off",
        "jsdoc/require-jsdoc": [
          "warn",
          { publicOnly: true, enableFixer: false },
        ],
        "jsdoc/no-multi-asterisks": ["warn", { allowWhitespace: true }],
        "jsdoc/tag-lines": "off",
      },
    },
    {
      files: ["packages/core/src/adapters.ts"],
      rules: {
        "@typescript-eslint/method-signature-style": "off",
      },
    },
  ],
  plugins: ["jest"],
}
