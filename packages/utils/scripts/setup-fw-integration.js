import { promises as fs } from "fs"
import path from "path"

const __dirname = path.dirname(new URL(import.meta.url).pathname)

// Check if name is provided
if (process.argv.length < 3) {
  console.error("Error: No name provided")
  process.exit(1)
}

const name = process.argv[2]
// Convert name to lowercase
const id = name
  .toLowerCase()
  // replace dots with empty string & replace spaces with dashes
  .replace(/\./g, "")
  .replace(/\s/g, "-")

// Delete directory if it exists
try {
  await fs.rm(path.join(__dirname, "../..", `frameworks-${id}`), {
    recursive: true,
  })
} catch {
  // ignore
}

// Copy directory
const sourceDir = path.join(__dirname, "../..", "frameworks-template")
const destinationDir = path.join(__dirname, "../..", `frameworks-${id}`)
await fs.mkdir(destinationDir)

console.log(`📂 Copying ${sourceDir} to ${destinationDir}`)

// copy the whole directory recursively
await fs.cp(sourceDir, destinationDir, { recursive: true })

// Delete node_modules & providers
await fs.rm(path.join(destinationDir, "node_modules"), { recursive: true })

try {
  const folderPath = path.join(destinationDir, "providers")
  // Check if the folder exists
  await fs.access(folderPath)

  // The folder exists, so delete it
  await fs.rm(folderPath, { recursive: true })
} catch (error) {
  console.log(
    "Skipping the deletion of `providers` folder as it does not exist"
  )
}

// Replace placeholders in files
const files = await fs.readdir(destinationDir, { withFileTypes: true })
for (const file of files) {
  if (file.isFile()) {
    const filePath = path.join(destinationDir, file.name)
    let content = await fs.readFile(filePath, "utf8")
    content = content
      .replace(/<framework-id>/g, id)
      .replace(/<framework-name>/g, name)
    await fs.writeFile(filePath, content, "utf8")
  }
}

// Rename `name` field in package.json
const packageJsonPath = path.join(destinationDir, "package.json")
let packageJson = JSON.parse(await fs.readFile(packageJsonPath, "utf8"))
packageJson.name = `@auth/frameworks-${id}`
await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2))

// Update redirects in vercel.json
const vercelJsonPath = path.join(__dirname, "../../..", "docs", "vercel.json")
let vercelJson = JSON.parse(await fs.readFile(vercelJsonPath, "utf8"))
vercelJson.redirects = [
  ...(vercelJson.redirects ? vercelJson.redirects : []),
  {
    source: "/",
    has: [{ type: "host", value: `${id}.authjs.dev` }],
    destination: `https://authjs.dev/reference/${id}`,
  },
]
await fs.writeFile(vercelJsonPath, JSON.stringify(vercelJson, null, 2))

// add a new line in pr-labeler.yml
const prLabelerPath = path.join(
  __dirname,
  "../../..",
  ".github",
  "pr-labeler.yml"
)
let prLabeler = await fs.readFile(prLabelerPath, "utf8")
const newEntry = 'frameworkId: ["packages/frameworks-frameworkId/**/*"]\n'
prLabeler += newEntry
// replace frameworkId with the id
prLabeler = prLabeler.replace(/frameworkId/g, id)

await fs.writeFile(prLabelerPath, prLabeler)

console.log("✅ Success. Please run `pnpm i` to install dependencies.")
