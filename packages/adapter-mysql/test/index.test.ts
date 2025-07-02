import { runBasicTests } from "../utils/adapter";
import mysqlAdapter, { mapExpiresAt } from "../src";
import mysql from "mysql2/promise";
import { AdapterUser } from "@auth/core/adapters";
const client = mysql.createPool({
  host: "127.0.0.1",
  database: "mysql_database",
  user: "root",
  password: "mysql",
  port: 3333,
});

runBasicTests({
  adapter: mysqlAdapter(client),
  db: {
    disconnect: async () => {
      await client.end();
    },
    user: async (id: string) => {
      const sql = `select * from users where id = ?`;
      const [result] = await client.query(sql, [id]);

      const [result1] = result as AdapterUser[];

      return result1 ? result1 : null;
    },
    account: async (account) => {
      const sql = `
          select * from accounts where providerAccountId = ?`;

      const [result] = await client.query(sql, [account.providerAccountId]);
      return result[0] ? mapExpiresAt(result[0]) : null;
    },
    session: async (sessionToken) => {
      const [result1] = await client.query(
        `select * from sessions where sessionToken = ?`,
        [sessionToken]
      );
      return result1[0] ? result1[0] : null;
    },
    async verificationToken(identifier_token) {
      const { identifier, token } = identifier_token;
      const sql = `
          select * from verification_token where identifier = ? and token = ?`;

      const [result] = await client.query(sql, [identifier, token]);
      return result[0] ? result[0] : null;
    },
  },
});
