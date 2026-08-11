import { MikroORM, Options } from "@mikro-orm/core"
import { BetterSqliteDriver } from "@mikro-orm/better-sqlite"
import { defaultEntities } from "../src"
import { expect, test } from "vitest"

const config: Options<BetterSqliteDriver> = {
  dbName: "./db.sqlite",
  driver: BetterSqliteDriver,
  entities: [
    defaultEntities.User,
    defaultEntities.Account,
    defaultEntities.Session,
    defaultEntities.VerificationToken,
  ],
}

test("run migrations", async () => {
  const orm = await MikroORM.init(config)
  await orm.getSchemaGenerator().dropSchema()

  const createSchemaSQL = await orm.getSchemaGenerator().getCreateSchemaSQL()
  expect(createSchemaSQL).toMatchSnapshot("createSchemaSQL")

  const targetSchema = await orm.getSchemaGenerator().getTargetSchema()
  expect(targetSchema).toMatchSnapshot("targetSchema")

  await orm.getSchemaGenerator().dropSchema()
  await orm.close().catch(() => null)
})
