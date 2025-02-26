import type {
  Adapter,
  AdapterUser,
  VerificationToken,
  AdapterSession,
} from "@auth/core/adapters";
import type { OkPacketParams, Pool } from "mysql2/promise";
// type k = AdapterUser & { password?: string };
export const mapExpiresAt = (account: any): any => {
  const expires_at: number = parseInt(account.expires_at);
  return {
    ...account,
    expires_at,
  };
};

const mysqlAdapter = (client: Pool): Adapter => {
  return {
    async createVerificationToken(
      verificationToken: VerificationToken
    ): Promise<VerificationToken> {
      const { identifier, expires, token } = verificationToken;
      const sql = `
        INSERT INTO verification_token ( identifier, expires, token ) 
        VALUES (?, ?, ?)
        `;
      await client.query(sql, [identifier, expires, token]);
      return verificationToken;
    },
    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string;
      token: string;
    }): Promise<VerificationToken | null> {
      const sql = `select * from verification_token
      where identifier = ? and token = ?`;
      const sql1 = `delete from verification_token
      where identifier = ? and token = ?
      `;

      try {
        const [result] = (await client.query(sql, [identifier, token])) as any;
        if (result[0]) {
          const [result1] = (await client.query(sql1, [
            identifier,
            token,
          ])) as OkPacketParams[];
          if (result1.affectedRows) {
            return result[0];
          }
        }
        return null;
      } catch {
        return null;
      }
    },

    async createUser(user: Omit<AdapterUser, "id">) {
      const { name, email, emailVerified, image } = user;
      const sql = `
        INSERT INTO users (name, email, emailVerified, image) 
        VALUES (?, ?, ?, ?) 
        `;
      const [result] = (await client.query(sql, [
        name,
        email,
        emailVerified,
        image,
      ])) as OkPacketParams[];
      const [result1] = await client.query("select * from users where id=?", [
        result.insertId,
      ]);
      const [reResult1] = result1 as AdapterUser[];
      return reResult1;
    },
    async getUser(id) {
      const sql = `select * from users where id = ?`;
      try {
        const [result] = await client.query(sql, [id]);
        const reResult = result as AdapterUser[];
        return reResult[0] ? reResult[0] : null;
      } catch (e) {
        return null;
      }
    },
    async getUserByEmail(email) {
      const sql = `select * from users where email = ?`;
      const [result] = await client.query(sql, [email]);
      const reResult = result as AdapterUser[];

      return reResult[0] ? reResult[0] : null;
    },
    async getUserByAccount({
      providerAccountId,
      provider,
    }): Promise<AdapterUser | null> {
      const sql = `
          select * from users u join accounts a on u.id = a.userId
          where 
          a.provider = ? 
          and 
          a.providerAccountId = ?`;

      const [result] = await client.query(sql, [provider, providerAccountId]);
      const reResult = result as AdapterUser[];
      if (reResult[0]) {
        const { email, emailVerified, id, image, name } = reResult[0];
        return { name, email, emailVerified, id, image };
      }
      return null;
    },
    async updateUser(
      user: Partial<AdapterUser> & Pick<AdapterUser, "id">
    ): Promise<AdapterUser> {
      const fetchSql = `select * from users where id = ?`;
      const [query1] = await client.query(fetchSql, [user.id]);
      const [oldUser] = query1 as AdapterUser[];

      const newUser = {
        ...oldUser,
        ...user,
      };

      const { id, name, email, emailVerified, image } = newUser;
      const updateSql = `
        UPDATE users set
        name =?, email = ?, emailVerified = ?, image = ?
        where id = ?
        
      `;
      const [query2] = (await client.query(updateSql, [
        name,
        email,
        emailVerified,
        image,
        id,
      ])) as OkPacketParams[];
      if (query2.affectedRows) return newUser;
      else throw new Error("nothing find ");
    },
    async linkAccount(account) {
      const sql = `
      insert into accounts 
      (
        userId, 
        provider, 
        type, 
        providerAccountId, 
        access_token,
        expires_at,
        refresh_token,
        id_token,
        scope,
        session_state,
        token_type
      )
      values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
        account.userId,
        account.provider,
        account.type,
        account.providerAccountId,
        account.access_token,
        account.expires_at,
        account.refresh_token,
        account.id_token,
        account.scope,
        account.session_state,
        account.token_type,
      ];

      const [result] = (await client.query(sql, params)) as OkPacketParams[];
      return result.insertId ? mapExpiresAt(account) : null;
    },
    async createSession({ sessionToken, userId, expires }) {
      if (userId === undefined) {
        throw Error(`userId is undef in createSession`);
      }
      const sql = `insert into sessions (userId, expires, sessionToken)
      values (?, ?, ?)
    `;

      const [result] = (await client.query(sql, [
        userId,
        expires,
        sessionToken,
      ])) as OkPacketParams[];
      if (result.insertId)
        return { id: result.insertId, sessionToken, userId, expires };
      else throw new Error("nothing created ");
    },

    async getSessionAndUser(sessionToken: string | undefined): Promise<{
      session: AdapterSession;
      user: AdapterUser;
    } | null> {
      if (sessionToken === undefined) {
        return null;
      }
      const [result1] = await client.query(
        `select * from sessions where sessionToken = ?`,
        [sessionToken]
      );
      const [oldUser] = result1 as AdapterSession[];

      if (!oldUser) {
        return null;
      }

      const [result2] = await client.query("select * from users where id = ?", [
        oldUser.userId,
      ]);
      const [newUser] = result2 as AdapterUser[];

      if (!newUser) {
        return null;
      }
      return {
        session: oldUser,
        user: newUser,
      };
    },
    async updateSession(
      session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">
    ): Promise<AdapterSession | null | undefined> {
      const { sessionToken } = session;
      const [result1] = await client.query(
        `select * from sessions where sessionToken = ?`,
        [sessionToken]
      );
      const [originalSession] = result1 as AdapterSession[];

      if (!originalSession) {
        return null;
      }

      const newSession: AdapterSession = {
        ...originalSession,
        ...session,
      };
      const sql = `
        UPDATE sessions set
        expires = ?
        where sessionToken = ?
        `;
      const [result] = (await client.query(sql, [
        newSession.expires,
        newSession.sessionToken,
      ])) as OkPacketParams[];
      return result.affectedRows ? newSession : null;
    },
    async deleteSession(sessionToken) {
      const sql = `delete from sessions where sessionToken = ?`;
      await client.query(sql, [sessionToken]);
    },
    async unlinkAccount(partialAccount) {
      const { provider, providerAccountId } = partialAccount;
      const sql = `delete from accounts where providerAccountId = ? and provider = ?`;
      await client.query(sql, [providerAccountId, provider]);
    },
    async deleteUser(userId: string) {
      await client.beginTransaction();
      try {
        await client.query(`delete from ${userTable} where id = ?`, [userId]);
        await client.query(`delete from sessions where userId = ?`, [userId]);
        await client.query(`delete from accounts where userId = ?`, [userId]);
        await client.commit();
      } catch (error) {
        await client.rollback();
        throw error;
      }
      return null;
    },
  };
};
export default mysqlAdapter;
