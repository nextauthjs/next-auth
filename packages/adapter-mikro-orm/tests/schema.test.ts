import { MikroORM, Options } from "@mikro-orm/core";
import { SqliteDriver } from "@mikro-orm/sqlite";
import { defaultEntities } from "../src";

const config: Options<SqliteDriver> = {
    dbName: "./db.sqlite",
    type: "sqlite",
    entities: [
        defaultEntities.User,
        defaultEntities.Account,
        defaultEntities.Session,
        defaultEntities.VerificationToken,
    ],
}

it("run migrations", async () => {
    const orm = await MikroORM.init(config)
    await orm.getSchemaGenerator().dropSchema()

    const createSchemaSQL = await orm.getSchemaGenerator().getCreateSchemaSQL()
    expect(createSchemaSQL).toMatchSnapshot('createSchemaSQL')

    const targetSchema = await orm.getSchemaGenerator().getTargetSchema()
    expect(targetSchema).toMatchSnapshot('targetSchema')

    await orm.getSchemaGenerator().dropSchema()
    await orm.close().catch(() => null)
})
