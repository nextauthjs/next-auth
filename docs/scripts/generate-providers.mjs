import { join } from "path"
import { readdirSync, readFileSync, writeFileSync } from "fs"

const providersPath = join(process.cwd(), "../packages/core/src/providers")

const files = readdirSync(providersPath, "utf8")

const notOAuth = [
  "index.ts",
  "oauth-types.ts",
  "email.ts",
  "credentials.ts",
  "oauth.ts",
]

const result = files.reduce((acc, file) => {
  if (notOAuth.includes(file)) return acc
  const provider = readFileSync(join(providersPath, file), "utf8")
  const { id } = provider.match(/id: "(?<id>.+)",/).groups
  const { title } = provider.match(/name: "(?<title>.+)",/).groups
  acc[id] = title
  return acc
}, {})

writeFileSync(
  join(process.cwd(), "providers.json"),
  JSON.stringify(result, null, 2)
)
