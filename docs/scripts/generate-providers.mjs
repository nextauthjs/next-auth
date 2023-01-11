import { join } from "path"
import { readdirSync, readFileSync, writeFileSync } from "fs"

// TODO: generate from core package
const providersPath = join(process.cwd(), "/docs/reference/05-oauth-providers")

const files = readdirSync(providersPath, "utf8")

const result = files.reduce((acc, file) => {
  if (file === "index.md" || file === "_category_.json") return acc
  const provider = readFileSync(join(providersPath, file), "utf8")
  const { id, title } = provider.match(
    /id: (?<id>.+)\ntitle: (?<title>.+)\n/
  ).groups
  acc[id] = title
  return acc
}, {})

writeFileSync(
  join(process.cwd(), "providers.json"),
  JSON.stringify(result, null, 2)
)
