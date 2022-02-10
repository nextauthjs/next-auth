import path from "path"

// TODO: Generate dynamically
export const packages = {
  "next-auth": "packages/next-auth",
  "adapter-dgraph": "packages/@next-auth/dgraph-adapter",
  "adapter-fauna": "packages/@next-auth/fauna-adapter",
  "adapter-mikro-orm": "packages/@next-auth/mikro-orm-adapter",
  "adapter-neo4j": "packages/@next-auth/neo4j-adapter",
  "adapter-prisma": "packages/@next-auth/prisma-adapter",
  "adapter-upstash-redis": "packages/@next-auth/upstash-redis-adapter",
  "adapter-dynamodb": "packages/@next-auth/dynamodb-adapter",
  "adapter-firebase": "packages/@next-auth/firebase-adapter",
  "adapter-mongodb": "packages/@next-auth/mongodb-adapter",
  "adapter-pouchdb": "packages/@next-auth/pouchdb-adapter",
  "adapter-sequelize": "packages/@next-auth/sequelize-adapter",
  "adapter-typeorm-legacy": "packages/@next-auth/typeorm-legacy-adapter",
}

export type PackageName = keyof typeof packages

export const rootDir = path.resolve(__dirname, "..")
export const RELEASE_COMMIT_MSG = "chore(release): bump version"
export const BREAKING_COMMIT_MSG = "BREAKING CHANGE"
export const SKIP_CI_COMMIT_MSG = "[skip ci]"
export const RELEASE_COMMIT_TYPES = ["feat", "fix", "chore"]
