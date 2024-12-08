// Use this script to re-export all providers from core in Auth.js frameworks

import fs from "fs/promises"
import { resolve, join } from "path"
import { parseArgs } from "node:util"

const sourceDir = resolve(process.cwd(), "../core/src/providers")

const args = parseArgs({
  args: process.argv.slice(2),
  options: { out: { type: "string", default: "src" } },
})
const { out } = args.values

const destinationDir = resolve(process.cwd(), join(out, "providers"))
const nonProvider = ["provider-types.ts", "oauth.ts"]
try {
  await fs.mkdir(destinationDir, { recursive: true })
  const files = (await fs.readdir(sourceDir)).filter(
    (file) => !nonProvider.includes(file)
  )
  for (const file of files) {
    const destinationPath = resolve(destinationDir, file)
    const provider = file.substring(0, file.indexOf("."))
    let content = `export * from "@auth/core/providers/${provider}"`
    if (provider !== "index") {
      content += `\nexport { default } from "@auth/core/providers/${provider}"`
    }

    content = content.replace(/\/index/g, "")
    await fs.writeFile(destinationPath, content)
  }
  console.log("All files copied successfully!")
} catch (error) {
  console.error("Error occurred while copying files:", error)
}
