/** @type {import("@swc/core").Config} */
module.exports = {
  jsc: {
    parser: { syntax: "typescript", tsx: true },
    transform: {
      react: { runtime: "automatic", importSource: "preact" },
    },
  },
}
