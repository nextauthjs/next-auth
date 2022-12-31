const path = require("path")

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      extends: ["standard-with-typescript", "prettier"],
      rules: {
        camelcase: "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
      },

      parserOptions: {
        project: [
          path.resolve(__dirname, "./packages/**/tsconfig.eslint.json"),
          path.resolve(__dirname, "./packages/frameworks/**/tsconfig.json"),
          path.resolve(__dirname, "./apps/**/tsconfig.json"),
        ],
      },
    },
  ],
  extends: ["prettier"],
  globals: {
    localStorage: "readonly",
    location: "readonly",
    fetch: "readonly",
  },
  rules: {
    camelcase: "off",
  },
  plugins: ["jest"],
  env: {
    "jest/globals": true,
  },
  ignorePatterns: [".eslintrc.js"],
}
