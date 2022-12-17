const doms = new Set([
  "Headers",
  "Request",
  "Response",
  "URL",
  "URLSearchParams",
])

module.exports.load = function load(app) {
  // Rewrite Web Standard API references to MDN links
  app.renderer.addUnknownSymbolResolver("typescript", (name) => {
    if (doms.has(name)) {
      return `https://developer.mozilla.org/en-US/docs/Web/API/${name}`
    }
  })
}
