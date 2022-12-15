// After build, copy the files in ./package to the root directory, excluding the package.json file.
import fs from "fs/promises"
import path from "path"

const __dirname = path.dirname(new URL(import.meta.url).pathname)

const root = path.join(__dirname, "..")
const pkgDir = path.join(root, "package")

await fs.cp(pkgDir, root, {
  recursive: true,
  filter: (src) => !src.includes("package.json"),
})
