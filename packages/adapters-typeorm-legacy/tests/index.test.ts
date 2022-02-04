// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore
import { parseConnectionString } from "../src/lib/config"

const connectionString = "mysql://root:password@localhost:3306/next-auth"

test("could parse connection string", () => {
  expect(parseConnectionString(connectionString)).toEqual(
    expect.objectContaining({
      type: "mysql",
      host: "localhost",
      port: 3306,
      username: "root",
      password: "password",
      database: "next-auth",
    })
  )
})
