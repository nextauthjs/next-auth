import globals from "globals";
import jsdoc from "eslint-plugin-jsdoc";
import eslintConfigPrettier from "eslint-config-prettier";
import eslintPluginSvelte from "eslint-plugin-svelte";
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import tsEslint from 'typescript-eslint';
import reactRecommended from 'eslint-plugin-react/configs/recommended.js';
import reactJsxRuntime from 'eslint-plugin-react/configs/jsx-runtime.js';
import svelteParser from 'svelte-eslint-parser';
import pluginImportX from 'eslint-plugin-import-x';
import pluginPromise from 'eslint-plugin-promise'


export default tsEslint.config(
  js.configs.recommended,
  ...tsEslint.configs.recommended,
  ...eslintPluginSvelte.configs['flat/recommended'],
  eslintConfigPrettier,
  ...eslintPluginSvelte.configs['flat/prettier'],
  pluginPromise.configs['flat/recommended'],
  {
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
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 5,
      sourceType: "script",
      parserOptions: {
        project: ["./packages/**/tsconfig.json", "./apps/**/tsconfig.json"],
      },
    },
    settings: {
      react: {
        version: "18",
      },
    },
    rules: {
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/method-signature-style": "off",
      "@typescript-eslint/naming-convention": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "off",
    },
    plugins: {
      'import-x': pluginImportX,
    }
  },
  {
    files: ["packages/{core,sveltekit}/*.ts"],
    plugins: {
      jsdoc,
    },
    rules: {
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",

      "jsdoc/require-jsdoc": ["warn", {
        publicOnly: true,
        enableFixer: false,
      }],

      "jsdoc/no-multi-asterisks": ["warn", {
        allowWhitespace: true,
      }],

      "jsdoc/tag-lines": "off",
    },
  },
  {
    // files: ["packages/frameworks-sveltekit"],
    files: ["**/*.svelte"],
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
    ignores: [
      '**/.*', // dotfiles aren't ignored by default in FlatConfig
      '.*', // dotfiles aren't ignored by default in FlatConfig
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
      "*.cjs",
      "*.js",
      "*.d.ts",
      "*.d.ts.map",
      ".svelte-kit",
      ".next",
      ".nuxt",
      "build",
      "static",
      "coverage",
      "dist",
      "packages/core/src/providers/oauth-types.ts",
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
      "packages/**/*test*"
    ]
  },
)

// export default [...compat.extends("eslint:recommended", "prettier"), {
//   languageOptions: {
//     globals: {
//       ...globals.browser,
//       ...globals.node,
//     },
//
//     ecmaVersion: "latest",
//     sourceType: "module",
//
//     parserOptions: {
//       ecmaFeatures: {
//         jsx: true,
//       },
//     },
//   },
// }, ...compat.extends("plugin:react/recommended", "plugin:react/jsx-runtime", "prettier").map(config => ({
//   ...config,
//   files: ["**/*.ts", "**/*.tsx"],
// })), {
//   files: ["**/*.ts", "**/*.tsx"],
//
//   languageOptions: {
//     parser: tsParser,
//     ecmaVersion: 5,
//     sourceType: "script",
//
//     parserOptions: {
//       project: ["./packages/**/tsconfig.json", "./apps/**/tsconfig.json"],
//     },
//   },
//
//   settings: {
//     react: {
//       version: "18",
//     },
//   },
//
//   rules: {
//     "@typescript-eslint/explicit-function-return-type": "off",
//     "@typescript-eslint/method-signature-style": "off",
//     "@typescript-eslint/naming-convention": "off",
//     "@typescript-eslint/no-non-null-assertion": "off",
//     "@typescript-eslint/restrict-template-expressions": "off",
//     "@typescript-eslint/strict-boolean-expressions": "off",
//     "react/prop-types": "off",
//     "react/no-unescaped-entities": "off",
//   },
// }, ...compat.extends("plugin:jsdoc/recommended").map(config => ({
//   ...config,
//   files: ["packages/{core,sveltekit}/*.ts"],
// })), {
//   files: ["packages/{core,sveltekit}/*.ts"],
//
//   plugins: {
//     jsdoc,
//   },
//
//   rules: {
//     "jsdoc/require-param": "off",
//     "jsdoc/require-returns": "off",
//
//     "jsdoc/require-jsdoc": ["warn", {
//       publicOnly: true,
//       enableFixer: false,
//     }],
//
//     "jsdoc/no-multi-asterisks": ["warn", {
//       allowWhitespace: true,
//     }],
//
//     "jsdoc/tag-lines": "off",
//   },
// }, ...compat.extends("plugin:svelte/recommended").map(config => ({
//   ...config,
//   files: ["packages/frameworks-sveltekit"],
// })), {
//   files: ["packages/frameworks-sveltekit"],
//
//   languageOptions: {
//     globals: {
//       ...globals.browser,
//       ...globals.node,
//     },
//
//     parser: tsParser,
//     ecmaVersion: 2020,
//     sourceType: "module",
//
//     parserOptions: {
//       extraFileExtensions: [".svelte"],
//     },
//   },
// }];
