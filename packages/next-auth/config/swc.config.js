/** @type {import("@swc/core").Config} */
module.exports = {
  jsc: {
    parser: {
      syntax: "typescript",
      tsx: true,
    },
    transform: {
      react: {
        runtime: "automatic",
        pragma: "React.createElement",
        pragmaFrag: "React.Fragment",
        throwIfNamespace: true,
        useBuiltins: true,
      },
    },
  },
}
