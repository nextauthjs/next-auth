import { migrate } from 'drizzle-orm/mysql2/migrator'
import { drizzle } from "drizzle-orm/mysql2";
import { createConnection } from "mysql2/promise";

const migrator = async () => {
  const connection = await createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "next-auth",
  });

  const db = drizzle(connection);

  await migrate(db, { migrationsFolder: "./test/mysql-multi-project-schema/.drizzle" })
}

migrator()
  .then(() => process.exit(0))
  .catch(() => process.exit(1))
