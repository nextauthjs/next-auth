import type { SqliteDriver } from "@mikro-orm/sqlite"
import { MikroOrmAdapter, defaultEntities } from "../src"
import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
  MikroORM,
  wrap,
  Options,
  types,
} from "@mikro-orm/core"
import { randomUUID, runBasicTests } from "@next-auth/adapter-test"

@Entity()
export class User implements defaultEntities.User {
  @PrimaryKey()
  @Property({ type: types.string })
  id: string = randomUUID()

  @Property({ type: types.string, nullable: true })
  name?: string

  @Property({ type: types.string, nullable: true })
  @Unique()
  email: string = ""

  @Property({ type: "Date", nullable: true })
  emailVerified: Date | null = null

  @Property({ type: types.string, nullable: true })
  image?: string

  @OneToMany({
    entity: "Session",
    mappedBy: (session: defaultEntities.Session) => session.user,
    hidden: true,
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  sessions = new Collection<defaultEntities.Session>(this)

  @OneToMany({
    entity: "Account",
    mappedBy: (account: defaultEntities.Account) => account.user,
    hidden: true,
    orphanRemoval: true,
    cascade: [Cascade.ALL],
  })
  accounts = new Collection<defaultEntities.Account>(this)

  @Property({ type: types.string, hidden: true })
  role = "ADMIN"
}

@Entity()
export class VeryImportantEntity {
  @PrimaryKey()
  @Property({ type: types.string })
  id: string = randomUUID()

  @Property({ type: types.boolean })
  important = true
}

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
