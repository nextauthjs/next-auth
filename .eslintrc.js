const path = require('path')

module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: [
      path.resolve(__dirname, './packages/adapter-**/tsconfig.json'),
      path.resolve(__dirname, './packages/next-auth/tsconfig.eslint.json'),
      path.resolve(__dirname, 'tsconfig.json')
    ],
    tsconfigRootDir: __dirname
  },
  extends: [
    "standard-with-typescript",
    "prettier"
  ],
  globals: {
    localStorage: "readonly",
    location: "readonly",
    fetch: "readonly"
  },
  rules: {
    "camelcase": "off",
    "@typescript-eslint/naming-convention": "off",
    "@typescript-eslint/strict-boolean-expressions": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/restrict-template-expressions": "off"
  },
  "plugins": ["jest"],
  "env": {
    "jest/globals": true
  }
}