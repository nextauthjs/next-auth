// We aim to have the same support as Next.js
// https://nextjs.org/docs/getting-started#system-requirements
// https://nextjs.org/docs/basic-features/supported-browsers-features

module.exports = {
  presets: [
    ["@babel/preset-env", { targets: { node: 12 } }],
    "@babel/preset-typescript",
  ],
  plugins: [
    "@babel/plugin-proposal-optional-catch-binding",
    "@babel/plugin-transform-runtime",
  ],
  ignore: ["../src/**/__tests__/**", "../src/adapters.ts"],
  overrides: [
    {
      test: ["../src/react.tsx"],
      presets: [
        ["@babel/preset-env", { targets: { ie: 11 } }],
        ["@babel/preset-react", { runtime: "automatic" }],
      ],
    },
    {
      test: ["../src/server/pages/*.tsx"],
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
