import { join } from "path"
import { readdir, readFile, writeFile } from "fs/promises"

const frameworks = {}

// TODO: Autogenerate
// const packagesPath = join(process.cwd(), "../packages")
// const adaptersPaths = await readdir(packagesPath).then((d) =>
//   d.filter((dirent) => dirent.startsWith("adapter-"))
// )
// const adapters = await adaptersPaths.reduce((acc, path) => {
//   const id = path.replace("adapter-", "")
//   const name = id
//     .split("-")
//     .map((w) => w[0].toUpperCase() + w.slice(1))
//     .join(" ")
//   acc[id] = name
//   return acc
// }, {})

const adapters = {
  "azure-tables": ["Azure Tables Storage"],
  d1: ["D1"],
  dgraph: ["Dgraph", "dgraph.png"],
  drizzle: ["Drizzle ORM", "drizzle-orm.png"],
  dynamodb: ["DynamoDB", "dynamodb.png"],
  edgedb: ["EdgeDB"],
  fauna: ["Fauna", "fauna.png"],
  firebase: ["Firebase"],
  hasura: ["Hasura"],
  kysely: ["Kysely"],
  "mikro-orm": ["Mikro ORM", "mikro-orm.png"],
  mongodb: ["MongoDB"],
  neo4j: ["Neo4j"],
  pg: ["pg", "pg.png"],
  pouchdb: ["PouchDB"],
  prisma: ["Prisma"],
  sequelize: ["Sequelize"],
  supabase: ["Supabase"],
  surrealdb: ["SurrealDB", "surreal.png"],
  typeorm: ["TypeORM", "typeorm.png"],
  "upstash-redis": ["Upstash Redis"],
  xata: ["Xata"],
}

const providersPath = join(process.cwd(), "../packages/core/src/providers")
const providerFiles = await readdir(providersPath, "utf8")
const notOAuth = [
  "index.ts",
  "oauth-types.ts",
  "email.ts",
  "credentials.ts",
  "oauth.ts",
]

const providers = {}

for (const file of providerFiles) {
  if (notOAuth.includes(file)) continue
  const provider = await readFile(join(providersPath, file), "utf8")
  const { id } = provider.match(/id: "(?<id>.+)",/).groups
  const { title } = provider.match(/name: "(?<title>.+)",/).groups
  providers[id] = title
}

await writeFile(
  join(process.cwd(), "manifest.json"),
  JSON.stringify({ frameworks, adapters, providers }, null, 2)
)
