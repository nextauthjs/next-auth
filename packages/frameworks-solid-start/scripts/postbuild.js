import path from "path"
import fs from "fs/promises"
import { fileURLToPath } from "node:url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const root = path.join(__dirname, "../")
  const dist = path.join(root, "dist")
  await fs.cp(dist, root, {
    recursive: true,
  })
}

main()
