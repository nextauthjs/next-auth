import type { Options } from "@mikro-orm/core"
import type { SqliteDriver } from "@mikro-orm/sqlite"

import { MikroORM, wrap } from "@mikro-orm/core"
import { runBasicTests } from "adapter-test"
import { MikroOrmAdapter, defaultEntities } from "../src"
import { User, VeryImportantEntity } from "./testEntities"

let _init: MikroORM

const entities = [
  User,
  defaultEntities.Account,
  defaultEntities.Session,
  defaultEntities.VerificationToken,
  VeryImportantEntity,
]

const config: Options<SqliteDriver> = {
  dbName: "./db.sqlite",
  type: "sqlite",
  entities,
  debug: process.env.DEBUG === "true" || process.env.DEBUG?.includes("db"),
}

async function getORM() {
  if (_init) return _init

  _init = await MikroORM.init(config)
  return _init
}

runBasicTests({
  adapter: MikroOrmAdapter(config, { entities: { User } }),
  db: {
    async connect() {
      const orm = await getORM()
      await orm.getSchemaGenerator().dropSchema()
      await orm.getSchemaGenerator().createSchema()
    },
    async disconnect() {
      const orm = await getORM()
      // its fine to tear down the connection if it has been already closed
      await orm
        .getSchemaGenerator()
        .dropSchema()
        .catch(() => null)
      await orm.close().catch(() => null)
    },
    async verificationToken(identifier_token) {
      const orm = await getORM()
      const token = await orm.em
        .fork()
        .findOne(defaultEntities.VerificationToken, identifier_token)
      if (!token) return null
      return wrap(token).toObject()
    },
    async user(id) {
      const orm = await getORM()
      const user = await orm.em.fork().findOne(defaultEntities.User, { id })
      if (!user) return null
      return wrap(user).toObject()
    },
    async account(provider_providerAccountId) {
      const orm = await getORM()
      const account = await orm.em
        .fork()
        .findOne(defaultEntities.Account, { ...provider_providerAccountId })
      if (!account) return null
      return wrap(account).toObject()
    },
    async session(sessionToken) {
      const orm = await getORM()
      const session = await orm.em
        .fork()
        .findOne(defaultEntities.Session, { sessionToken })
      if (!session) return null
      return wrap(session).toObject()
    },
  },
})
