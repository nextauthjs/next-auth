import type { Adapter } from "next-auth/adapters";
import type { Client } from "edgedb";

import e from "../dbschema/edgeql-js";

export function EdgeDBAdapter(client: Client): Adapter {
  return {
    async createUser(user) {
      const query = e.select(
        e.insert(e.User, {
          email: user.email,
          emailVerified: user.emailVerified,
          name: user.name,
          image: user.image,
        }),
        () => ({
          id: true,
          email: true,
          emailVerified: true,
          name: true,
          image: true,
        })
      );

      return await query.run(client);
    },
    async getUser(id) {
      const query = e.select(e.User, () => ({
        id: true,
        email: true,
        emailVerified: true,
        name: true,
        image: true,
        filter_single: { id },
      }));

      return await query.run(client);
    },
    async getUserByEmail(email) {
      const query = e.select(e.User, () => ({
        id: true,
        email: true,
        emailVerified: true,
        name: true,
        image: true,
        filter_single: { email },
      }));

      return await query.run(client);
    },
    async getUserByAccount({ providerAccountId }) {
      const query = e
        .select(e.User, (user) => ({
          ...e.User["*"],
          filter_single: e.op(
            user.accounts.providerAccountId,
            "=",
            providerAccountId
          ),
        }))
        .assert_single();

      return await query.run(client);
    },
    async updateUser({ email, emailVerified, id, image, name }) {
      const updatedUser = await e
        .update(e.User, () => ({
          filter_single: { id: String(id) },
          set: {
            ...(email && { email }),
            ...(emailVerified && { emailVerified }),
            ...(image && { image }),
            ...(name && { name }),
          },
        }))
        .run(client);

      if (!updatedUser) {
        throw new Error("could not update user");
      }

      const user = await e
        .select(e.User, () => ({
          id: true,
          email: true,
          emailVerified: true,
          image: true,
          name: true,
          filter_single: {
            id: updatedUser.id,
          },
        }))
        .run(client);

      if (user) {
        return user;
      } else {
        throw new Error("could not find updated user");
      }
    },
    async deleteUser(id) {
      const query = e.delete(e.User, () => ({
        filter_single: { id },
      }));

      await query.run(client);
    },
    async linkAccount({
      userId,
      type,
      provider,
      providerAccountId,
      refresh_token,
      access_token,
      expires_at,
      token_type,
      scope,
      id_token,
      session_state,
    }) {
      const query = e.insert(e.Account, {
        userId,
        type,
        provider,
        providerAccountId,
        refresh_token,
        access_token,
        expires_at,
        token_type,
        scope,
        id_token,
        session_state,
        user: e.select(e.User, () => ({
          filter_single: { id: userId },
        })),
      });
      await query.run(client);

      return;
    },
    async unlinkAccount({ providerAccountId }) {
      const query = e.delete(e.Account, (account) => ({
        filter: e.op(account.providerAccountId, "=", providerAccountId),
      }));

      await query.run(client);
    },
    async createSession({ expires, sessionToken, userId }) {
      const query = e.insert(e.Session, {
        expires,
        sessionToken,
        userId,
        user: e.select(e.User, () => ({
          filter_single: { id: userId },
        })),
      });

      const result = await query.run(client);

      if (!result) {
        throw new Error("could not create session");
      }

      return {
        expires,
        sessionToken,
        userId,
      };
    },
    async getSessionAndUser(sessionToken) {
      const query = e.select(e.Session, () => ({
        userId: true,
        id: true,
        expires: true,
        sessionToken: true,
        user: {
          id: true,
          email: true,
          emailVerified: true,
          image: true,
          name: true,
        },
        filter_single: { sessionToken },
      }));

      const sessionAndUser = await query.run(client);

      if (!sessionAndUser) {
        return null;
      }

      const { user, ...session } = sessionAndUser;

      if (!user || !session) {
        return null;
      }

      return {
        user,
        session,
      };
    },
    async updateSession({ sessionToken, expires, userId }) {
      const query = e.select(
        e.update(e.Session, () => ({
          filter_single: { sessionToken },
          set: {
            ...(sessionToken && { sessionToken }),
            ...(expires && { expires }),
            ...(userId && { userId }),
          },
        })),
        () => ({
          sessionToken: true,
          expires: true,
          userId: true,
        })
      );

      return query.run(client);
    },
    async deleteSession(sessionToken) {
      await e.delete(e.Session, () => ({ filter_single: { sessionToken } })).run(
        client
      );
    },
    async createVerificationToken({ identifier, expires, token }) {
      const query = e.select(
        e.insert(e.VerificationToken, {
          identifier,
          expires,
          token,
        }),
        () => ({
          identifier: true,
          expires: true,
          token: true,
        })
      );

      return await query.run(client);
    },
    async useVerificationToken({ token }) {
      const query = e.select(
        e.delete(e.VerificationToken, () => ({
          filter_single: { token },
        })),
        () => ({
          identifier: true,
          expires: true,
          token: true,
        })
      );

      return await query.run(client);
    },
  };
}
