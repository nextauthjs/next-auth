// @ts-check

/** @type {import("eslint").ESLint.Options} */
module.exports = {
  parserOptions: { ecmaVersion: "latest" },
  root: true,
  env: { browser: true, node: true },
  globals: { JSX: true },
  ignorePatterns: ["node_modules", "public", "**/*/_meta.js"],
  overrides: [
    {
      files: ["*.{ts,tsx}"],
      parser: "@typescript-eslint/parser",
      parserOptions: {
        project: "./tsconfig.json",
      },
      plugins: ["@typescript-eslint"],
      extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:@typescript-eslint/recommended",
      ],
      settings: { react: { version: "detect" } },
      // When adding a new rule or disabling a rule, please add a comment for why!
      rules: {
        // typescript does this already
        "react/prop-types": "off",
        // Unused things are fine if tagged with _
        "@typescript-eslint/no-unused-vars": [
          "error",
          { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
        ],
        // No consoles ha ha
        "no-console": "error",
        // React does not have to be imported in the latest version of React
        "react/react-in-jsx-scope": "off",
        // Most of the time useless...
        "react/no-unescaped-entities": "off",
        // to ensure an actual error is suppressed
        "@typescript-eslint/prefer-ts-expect-error": "error",
        // enforce consistent styling for component declarations
        "react/function-component-definition": [
          2,
          { namedComponents: "function-declaration" },
        ],
        // keep callback styling consistent
        "prefer-arrow-callback": 2,
        // async things should be awaited 99.9% of the time
        "@typescript-eslint/no-floating-promises": "error",
        "react/no-unescaped-entities": "off",
      },
    },
  ],
};
