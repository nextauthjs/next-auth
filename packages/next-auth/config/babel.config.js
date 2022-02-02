// We aim to have the same support as Next.js
// https://nextjs.org/docs/getting-started#system-requirements
// https://nextjs.org/docs/basic-features/supported-browsers-features

module.exports = (api) => {
  const isTest = api.env("test")
  if (isTest) {
    return {
      presets: [
        "@babel/preset-env",
        ["@babel/preset-react", { runtime: "automatic" }],
        ["@babel/preset-typescript", { isTSX: true, allExtensions: true }],
      ],
    }
  }
  return {
    presets: [
      ["@babel/preset-env", { targets: { node: 12 } }],
      "@babel/preset-typescript",
    ],
    plugins: [
      "@babel/plugin-proposal-optional-catch-binding",
      "@babel/plugin-transform-runtime",
    ],
    ignore: [
      "../src/**/__tests__/**",
      "../src/adapters.ts",
      "../src/lib/types.ts",
      "../src/providers/oauth-types.ts",
    ],
    comments: false,
    overrides: [
      {
        test: [
          "../src/react/index.tsx",
          "../src/lib/logger.ts",
          "../src/core/errors.ts",
          "../src/client/**",
        ],
        presets: [
          ["@babel/preset-env", { targets: { ie: 11 } }],
          ["@babel/preset-react", { runtime: "automatic" }],
        ],
      },
      {
        test: ["../src/core/pages/*.tsx"],
        presets: ["preact"],
        plugins: [
          [
            "jsx-pragmatic",
            {
              module: "preact",
              export: "h",
              import: "h",
            },
          ],
        ],
      },
    ],
  }
}
