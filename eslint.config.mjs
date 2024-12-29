import globals from "globals"
import jsdoc from "eslint-plugin-jsdoc"
import eslintConfigPrettier from "eslint-config-prettier"
import eslintPluginSvelte from "eslint-plugin-svelte"
import js from "@eslint/js"
import tsParser from "@typescript-eslint/parser"
import tsEslint from "typescript-eslint"
import reactRecommended from "eslint-plugin-react/configs/recommended.js"
import reactJsxRuntime from "eslint-plugin-react/configs/jsx-runtime.js"
import svelteParser from "svelte-eslint-parser"
import pluginImportX from "eslint-plugin-import-x"
import { includeIgnoreFile } from "@eslint/compat"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const gitignorePath = path.resolve(__dirname, ".gitignore")

export default tsEslint.config(
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  eslintConfigPrettier,
  {
    name: "React",
    files: ["**/*.{ts,tsx,jsx}"],
    ...reactRecommended,
    ...reactJsxRuntime,
    languageOptions: {
      ...reactRecommended.languageOptions,
      globals: {
        ...globals.serviceworker,
        ...globals.browser,
      },
    },
  },
  {
    name: "TypeScript",
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        projectService: true,
        project: ["./packages/utils/tsconfig.eslint.json"],
      },
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    settings: {
      react: {
        version: "18",
      },
    },
    rules: {
      "prefer-const": ["error", { destructuring: "all" }],
      "no-empty": ["error", { allowEmptyCatch: true }],
      "@typescript-eslint/no-floating-promises": "error",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-object-type": [
        "error",
        {
          allowInterfaces: "with-single-extends",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/method-signature-style": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          caughtErrors: "all",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          ignoreRestSiblings: true,
        },
      ],
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
    },
    plugins: {
      "import-x": pluginImportX,
    },
  },
  {
    name: "JSDoc",
    files: ["packages/{core,sveltekit}/*.ts"],
    ignores: ["**/*.d.ts"],
    languageOptions: {
      parser: tsEslint.parser,
    },
    plugins: {
      jsdoc,
    },
    rules: {
      "jsdoc/tag-lines": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/require-jsdoc": [
        "warn",
        {
          publicOnly: true,
          enableFixer: false,
        },
      ],
      "jsdoc/no-multi-asterisks": [
        "warn",
        {
          allowWhitespace: true,
        },
      ],
    },
  },
  {
    name: "SvelteKit",
    files: ["**/*.svelte"],
    ...eslintPluginSvelte.configs["flat/recommended"].rules,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      ecmaVersion: 2020,
      sourceType: "module",
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".svelte"],
      },
    },
  },
  {
    name: "Global Ignores",
    ignores: [
      ...includeIgnoreFile(gitignorePath).ignores,
      "**/.*", // dotfiles aren't ignored by default in FlatConfig
      ".*", // dotfiles aren't ignored by default in FlatConfig
      ".eslintrc.js",
      ".cache-loader",
      ".DS_Store",
      ".pnpm-debug.log",
      ".turbo",
      ".vscode/generated*",
      "/_work",
      "/actions-runner",
      "node_modules",
      "patches",
      "pnpm-lock.yaml",
      ".github/actions/issue-validator/index.mjs",
      "**/*.cjs",
      "**/*.js",
      "**/*.d.ts",
      "**/*.d.ts.map",
      ".svelte-kit",
      ".next",
      ".nuxt",
      "build",
      "static",
      "coverage",
      "dist",
      "packages/core/src/providers/provider-types.ts",
      "packages/core/src/lib/pages/styles.ts",
      "packages/frameworks-sveltekit/package",
      "packages/frameworks-sveltekit/vite.config.{js,ts}.timestamp-*",
      ".branches",
      "db.sqlite",
      "dev.db",
      "dynamodblocal-bin",
      "firebase-debug.log",
      "firestore-debug.log",
      "migrations",
      "test.schema.gql",
      "apps",
      "packages/**/*test*",
      "docs/**",
    ],
  }
)
