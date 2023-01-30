// After build, copy the files in ./package to the root directory, excluding the package.json file.

import fs from "fs/promises"
import path from "path"

let __dirname = path.dirname(new URL(import.meta.url).pathname)

// The above hack to polyfill "__dirname" for ESM does not work on Windows computers,
// so we might have to manually perform more steps.
__dirname = __dirname.split(path.sep).join(path.posix.sep)
if (__dirname.match(/^\/\w:\//)) {
  __dirname = __dirname.slice(3) // Remove the drive prefix.
}

const root = path.join(__dirname, "..")
const pkgDir = path.join(root, "package")

await fs.cp(pkgDir, root, {
  recursive: true,
  filter: (src) => !src.includes("package.json"),
})
