// To support serverless targets (which don't work if you try to read in things
// like CSS files at run time) this file is replaced in production builds with
// a function that returns compiled CSS (embedded as a string in the function).

export default function css() {
  if (globalThis.EdgeRuntime) return "TODO"
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const fs = require("fs")
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const path = require("path")

  const pathToCss = path.join(
    process.cwd(),
    process.env.NODE_ENV === "development"
      ? "node_modules/next-auth/css/index.css"
      : "/src/css/index.css"
  )
  return fs.readFileSync(pathToCss, "utf8")
}
