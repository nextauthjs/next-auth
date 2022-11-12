import type { Adapter, AdapterSession, AdapterUser } from "next-auth/adapters";
import type { Client } from "edgedb";

export function EdgeDBAdapter(client: Client): Adapter {
  return {
    async createUser({ email, emailVerified, name, image }) {
      return await client.queryRequiredSingle(
        `
        with
          image := <optional str>$image,
          name := <optional str>$name,
          emailVerified := <optional str>$emailVerified

        select (
          insert User {
            email:= <str>$email,
            emailVerified:= <datetime>emailVerified,
            name:= name ?? .name,
            image:= image ?? .name,
          }
        ) {
            id,
            email,
            emailVerified,
            name,
            image
          }
        `,
        { email, emailVerified: emailVerified && new Date(emailVerified).toISOString(), name, image }
      );
    },
    async getUser(id) {
      return await client.querySingle(
        `
        select User {
          id,
          email,
          emailVerified,
          name,
          image
        } filter .id = <uuid>$id;
        `,
        { id }
      );
    },
    async getUserByEmail(email) {
      return await client.querySingle(
        `
        select User {
          id,
          email,
          emailVerified,
          name,
          image
        } filter .email = <str>$email;
        `,
        { email }
      );
    },
    async getUserByAccount({ providerAccountId, provider }) {
      return await client.querySingle(
        `
        select User {
          id,
          email,
          image,
          name,
          emailVerified,
        } filter 
          .accounts.providerAccountId = <str>$providerAccountId
          and
          .accounts.provider = <str>$provider
          limit 1;
        `,
        { providerAccountId, provider }
      );
    },
    async updateUser({ email, emailVerified, id, image, name }) {
      return await client.queryRequiredSingle(
        `       
        with 
          email := <optional str>$email,
          emailVerified := <optional str>$emailVerified, 
          image := <optional str>$image,
          name := <optional str>$name
        
        select (
          update User
          filter .id = <uuid>$id
          set {
            email := email ?? .email,
            emailVerified := <datetime>emailVerified ?? .emailVerified,
            image := image ?? .image,
            name := name ?? .name,
          }
        ) {
          id,
          email,
          emailVerified,
          image,
          name
        }
        `,
        { email, emailVerified: emailVerified && new Date(emailVerified).toISOString(), id, image, name }
      );
    },
    async deleteUser(id) {
      await client.execute(`delete User filter .id = <uuid>$id;`, { id });
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
      await client.execute(
        `
        with 
          userId := <str>$userId,
          userIdAsUUID := <uuid>userId,
          refresh_token := <optional str>$refresh_token,
          access_token := <optional str>$access_token,
          expires_at := <optional str>$expires_at,
          token_type := <optional str>$token_type,
          scope := <optional str>$scope,
          id_token := <optional str>$id_token,
          session_state := <optional str>$session_state

        insert Account {
          userId := userId,
          type := <str>$type,
          provider := <str>$provider,
          providerAccountId := <str>$providerAccountId,
          refresh_token := refresh_token ?? .refresh_token,
          access_token := access_token ?? .access_token,
          expires_at := <int64>expires_at,
          token_type := token_type ?? .token_type,
          scope := scope ?? .scope,
          id_token := id_token ?? .id_token,
          session_state := session_state ?? .session_state,
          user := (
            select User filter .id = userIdAsUUID
          )
        }
        `,
        {
          userId,
          type,
          provider,
          providerAccountId,
          refresh_token,
          access_token,
          expires_at: expires_at && String(expires_at),
          token_type,
          scope,
          id_token,
          session_state,
        }
      );
    },
    async unlinkAccount({ providerAccountId, provider }) {
      await client.execute(
        `
        delete Account filter 
        .providerAccountId = <str>$providerAccountId
        and
        .provider = <str>$provider
        `,
        { providerAccountId, provider }
      );
    },
    async createSession({ expires, sessionToken, userId }) {
      return await client.queryRequiredSingle(
        `
        with 
          userId := <str>$userId,
          userIdAsUUID := <uuid>userId
        
        select (
          insert Session {
            expires := <datetime>$expires,
            sessionToken := <str>$sessionToken,
            userId := userId,
            user := (
              select User filter .id = userIdAsUUID
            )
          }
        ) {
          expires,
          sessionToken,
          userId
        };
      `,
        { expires, sessionToken, userId }
      );
    },
    async getSessionAndUser(sessionToken) {
      const sessionAndUser = await client.querySingle<
        AdapterSession & { user: AdapterUser }
      >(
        `
        select Session {
          userId,
          id,
          expires,
          sessionToken,
          user: {
            id,
            email,
            emailVerified,
            image,
            name
          }
        } filter .sessionToken = <str>$sessionToken;
      `,
        { sessionToken }
      );

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
      return await client.querySingle(
        `
        with 
          sessionToken := <optional str>$sessionToken,
          expires := <optional str>$expires, 
          userId := <optional str>$userId

        select (          
          update Session
          filter .sessionToken = <str>$sessionToken
          set {
            sessionToken := sessionToken ?? .sessionToken,
            expires := <datetime>expires ?? .expires,
            userId := userId ?? .userId
          }
        ) {
          sessionToken,
          userId,
          expires
        }
      `,
        { sessionToken, expires: expires && new Date(expires).toISOString(), userId }
      );
    },
    async deleteSession(sessionToken) {
      await client.query(
        `delete Session filter .sessionToken = <str>$sessionToken`,
        { sessionToken }
      );
    },
    async createVerificationToken({ identifier, expires, token }) {
      return await client.querySingle(
        `
        select (
          insert VerificationToken {
            identifier := <str>$identifier,
            expires := <datetime>$expires,
            token := <str>$token,
          }
        ) {
          identifier,
          expires,
          token
        }
        `,
        { identifier, expires, token }
      );
    },
    async useVerificationToken({ token }) {
      return await client.querySingle(
        `
        select (
          delete VerificationToken filter .token = <str>$token
        ) {
          identifier,
          expires,
          token
        }
        `,
        { token }
      );
    },
  };
}
