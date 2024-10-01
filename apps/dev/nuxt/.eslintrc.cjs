module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "prettier",
  ],
  plugins: ["eslint-plugin-vue", "@typescript-eslint"],
  ignorePatterns: ["*.cjs", "client.*", "index.*"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    extraFileExtensions: [".vue"],
    parser: "@typescript-eslint/parser",
    sourceType: "module",
  },
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
}
