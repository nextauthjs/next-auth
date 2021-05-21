// We aim to have the same support as Next.js
// https://nextjs.org/docs/getting-started#system-requirements
// https://nextjs.org/docs/basic-features/supported-browsers-features

module.exports = {
  presets: [["@babel/preset-env", { targets: { node: "10.13" } }]],
  plugins: [
    "@babel/plugin-proposal-optional-catch-binding",
    "@babel/plugin-transform-runtime",
  ],
  comments: false,
  overrides: [
    {
      test: ["../src/client/**"],
      presets: [["@babel/preset-env", { targets: { ie: "11" } }]],
    },
    {
      test: ["../src/server/pages/**"],
      presets: ["preact"],
    },
  ],
}
