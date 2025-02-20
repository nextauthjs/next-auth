/**
 * ## Installation
 *
 * ```bash
 * pnpm install @prisma/client @auth/redis-prisma-adapter
 * pnpm install prisma --save-dev
 * ```
 *
 * @module @auth/redis-prisma-adapter
 */

import { type PrismaClient } from "@prisma/client"
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import type {
  Adapter,
  AdapterAccount, AdapterAuthenticator,
  AdapterSession,
  AdapterUser, VerificationToken,
} from "@auth/core/adapters"
import { RedisClientType, RedisModules, RedisFunctions, SetOptions, RedisScripts } from "@redis/client"

const relation_fields: Record<string, string[]> = {
  User: ["accounts", "sessions", "Authenticator"],
  Account: ["user"],
  Session: ["user"],
  Authenticator: ["user"]
};

export type PrismaType = PrismaClient | ReturnType<PrismaClient["$extends"]>
export type RedisType = RedisClientType<RedisModules, RedisFunctions, RedisScripts>

/**
 * Create an adapter for Prisma and Redis.
 *
 * @param prisma_client - The Prisma client instance.
 * @param redis_client - The Redis client instance.
 * @param redis_namespace - The namespace to use for Redis keys.
 * @param redis_expiry - The expiry time for Redis keys.
 * @returns The adapter.
 */
export function RedisPrismaAdapter(
  prisma_client: PrismaType,
  redis_client: RedisType,
  redis_namespace: string,
  redis_expiry: number,
): Adapter {
  const prisma = prisma_client as PrismaClient
  const redis = redis_client

  const keys_expiration = {
    expiration: {
      type: 'EX',
      value: redis_expiry
    }
  } as SetOptions;

  return {
    createUser(user: AdapterUser): Promise<AdapterUser> {
      const { id, ...data } = user

      return prisma.user.create({
        data: strip_undefined(data),
      }) as Promise<AdapterUser>;
    },
    getUser(id: string): Promise<AdapterUser | null> {
      return redis.get(`${redis_namespace}:user:${id}`).then(async (user) => {
        if (user) return JSON.parse(user) as AdapterUser

        const data = await prisma.user.findUnique({ where: { id } })
        if (data) {
          await redis.set(`${redis_namespace}:user:${id}`, JSON.stringify(strip_relations("User", data)), keys_expiration)
          return data
        }

        return null
      }) as Promise<AdapterUser | null>;
    },
    getUserByEmail(email: string): Promise<AdapterUser | null> {
      const email_key = `${redis_namespace}:user:email:${email}`;

      return redis.get(email_key).then(async (user_id) => {
        if (user_id) {
          const user_key = `${redis_namespace}:user:${user_id}`;
          const cached_user = await redis.get(user_key);

          if (cached_user) return JSON.parse(cached_user) as AdapterUser;
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) return null;

        await redis.set(email_key, user.id, keys_expiration);
        await redis.set(`${redis_namespace}:user:${user.id}`, JSON.stringify(strip_relations("User", user)), keys_expiration);

        return user;
      }) as Promise<AdapterUser | null>;
    },
    async getUserByAccount(provider_id: Pick<AdapterAccount, "provider" | "providerAccountId">): Promise<AdapterUser | null> {
      const { provider, providerAccountId: account_id } = provider_id

      const account_key = `${redis_namespace}:account:${provider}:${account_id}`;
      let account = await redis.get(account_key);

      if (!account) {
        const fetched_account = await prisma.account.findUnique({
          where: { provider_providerAccountId: { provider, providerAccountId: account_id } },
          include: { user: true }
        });

        if (!fetched_account) return null;

        await redis.set(account_key, JSON.stringify(strip_relations("Account", fetched_account)), keys_expiration);
        account = JSON.stringify(fetched_account);
      }

      const parsed_account = JSON.parse(account) as AdapterAccount;
      const user_id = parsed_account.userId;

      const user_key = `${redis_namespace}:user:${user_id}`;
      const user = await redis.get(user_key);

      if (!user) {
        const fetched_user = await prisma.user.findUnique({ where: { id: user_id } });

        if (!fetched_user) return null;

        await redis.set(user_key, JSON.stringify(strip_relations("User", fetched_user)), keys_expiration);

        return fetched_user as AdapterUser;
      }

      return JSON.parse(user) as AdapterUser;
    },
    updateUser(user: Partial<AdapterUser> & Pick<AdapterUser, "id">): Promise<AdapterUser> {
      const { id, ...data } = user

      return prisma.user.update({
        where: { id },
        data: strip_undefined(data),
      }).then(async (updated_user) => {
        const stripped_user = strip_relations("User", updated_user);

        if (updated_user.email) {
          const email_key = `${redis_namespace}:user:email:${updated_user.email}`;
          await redis.set(email_key, updated_user.id, keys_expiration);
        }

        const user_key = `${redis_namespace}:user:${id}`;
        await redis.set(user_key, JSON.stringify(stripped_user), keys_expiration);

        return updated_user;
      }) as Promise<AdapterUser>;
    },
    deleteUser(user_id: string): Promise<void> | Promise<AdapterUser | null | undefined> {
      return prisma.user.delete({ where: { id: user_id } }).then(async (deleted_user) => {
        const user_key = `${redis_namespace}:user:${user_id}`;
        await redis.del(user_key);

        const email_key = `${redis_namespace}:user:email:${deleted_user.email}`;
        await redis.del(email_key);

        return deleted_user;
      }) as Promise<AdapterUser | null | undefined>;
    },

    linkAccount(account: AdapterAccount): Promise<void> | Promise<AdapterAccount | null | undefined> {
      const { provider, providerAccountId: account_id } = account

      return prisma.account.create({
        data: account,
      }).then(async (created_account) => {
        const account_key = `${redis_namespace}:account:${provider}:${account_id}`;

        await redis.set(account_key, JSON.stringify(strip_relations("Account", created_account)), keys_expiration);

        return created_account;
      }) as Promise<AdapterAccount | null | undefined>;
    },
    unlinkAccount(provider_id: Pick<AdapterAccount, "provider" | "providerAccountId">): Promise<void> | Promise<AdapterAccount | undefined> {
      const { provider, providerAccountId: account_id } = provider_id

      return prisma.account.delete({
        where: { provider_providerAccountId: { provider, providerAccountId: account_id } }
      }).then(async (deleted_account) => {
        const account_key = `${redis_namespace}:account:${provider}:${account_id}`;
        await redis.del(account_key);

        return deleted_account;
      }) as Promise<AdapterAccount | undefined>;
    },

    async getSessionAndUser(session_token: string): Promise<{ session: AdapterSession; user: AdapterUser; } | null> {
      const session_key = `${redis_namespace}:session:${session_token}`;

      const fetched_session = await redis.get(session_key);
      if (fetched_session) {
        const parsed_session = JSON.parse(fetched_session) as AdapterSession;

        const user_key = `${redis_namespace}:user:${parsed_session.userId}`;
        const user = await redis.get(user_key);

        if (user) {
          return {
            session: parsed_session,
            user: JSON.parse(user) as AdapterUser,
          };
        }

        const user_data = await prisma.user.findUnique({ where: { id: parsed_session.userId } });
        if (!user_data) return null;

        await redis.set(user_key, JSON.stringify(strip_relations("User", user_data)), keys_expiration);

        return {
          session: parsed_session,
          user: user_data as AdapterUser,
        };
      }

      const session_data = await prisma.session.findUnique({
        where: { sessionToken: session_token },
        include: { user: true },
      });

      if (!session_data) return null;

      const { user, ...session } = session_data;
      const user_key = `${redis_namespace}:user:${user.id}`;

      await redis.set(session_key, JSON.stringify(session), keys_expiration);
      await redis.set(user_key, JSON.stringify(strip_relations("User", user)), keys_expiration);

      return { session, user: user as AdapterUser };
    },
    async createSession(session: { sessionToken: string; userId: string; expires: Date }): Promise<AdapterSession> {
      const session_token = session.sessionToken;

      const created_session = await prisma.session.create(
        strip_undefined(session)
      );

      const session_key = `${redis_namespace}:session:${session_token}`;
      await redis.set(session_key, JSON.stringify(created_session), keys_expiration);

      return created_session;
    },
    async updateSession(session: Partial<AdapterSession> & Pick<AdapterSession, "sessionToken">): Promise<AdapterSession | null | undefined> {
      const {sessionToken: session_token, ...data} = session;
      const update_data = strip_undefined(data);

      const updated_session = await prisma.session.update({
        where: {sessionToken: session_token},
        data: update_data.data,
      });

      const session_key = `${redis_namespace}:session:${updated_session.sessionToken}`;
      await redis.set(session_key, JSON.stringify(updated_session), keys_expiration);

      return updated_session;
    },
    deleteSession(session_token: string): Promise<void> | Promise<AdapterSession | null | undefined> {
      return prisma.session.delete({
        where: { sessionToken: session_token },
      }).then(async (deleted_session) => {
        const session_key = `${redis_namespace}:session:${session_token}`;
        await redis.del(session_key);

        return deleted_session;
      }) as Promise<AdapterSession | null | undefined>;
    },

    // For verification tokens, we don't need to cache them in Redis
    async createVerificationToken(verification_token: VerificationToken): Promise<VerificationToken | null | undefined> {
      const create_data = strip_undefined(verification_token);

      const created_token = await prisma.verificationToken.create({
        data: create_data.data,
      });


      const { id, ...stripped_token } = created_token;
      return stripped_token;
    },
    async useVerificationToken(params: { identifier: string; token: string }): Promise<VerificationToken | null> {
      const { identifier, token } = params;

      try {
        const verification_token = await prisma.verificationToken.delete({
          where: { identifier_token: { identifier, token } },
        });

        const { id, ...stripped_token } = verification_token;
        return stripped_token;
      } catch (error: unknown) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if (
          error instanceof PrismaClientKnownRequestError &&
          error.code === "P2025"
        ) return null;

        throw error
      }
    },

    async getAccount(provider_account_id: AdapterAccount["providerAccountId"], provider: AdapterAccount["provider"]): Promise<AdapterAccount | null> {
      const account_key = `${redis_namespace}:account:${provider}:${provider_account_id}`;
      let account = await redis.get(account_key);

      if (!account) {
        const fetched_account = await prisma.account.findUnique({
          where: { provider_providerAccountId: { provider, providerAccountId: provider_account_id } },
          include: { user: true }
        });

        if (!fetched_account) return null;

        await redis.set(account_key, JSON.stringify(strip_relations("Account", fetched_account)), keys_expiration);
        account = JSON.stringify(fetched_account);
      }

      return JSON.parse(account) as AdapterAccount;
    },

    async createAuthenticator(authenticator: AdapterAuthenticator): Promise<AdapterAuthenticator> {
      const create_data = strip_undefined(authenticator);

      const created_authenticator = await prisma.authenticator.create({
        data: create_data.data,
      });

      const authenticator_key = `${redis_namespace}:authenticator:${authenticator.credentialID}`;
      await redis.set(authenticator_key, JSON.stringify(strip_relations("Authenticator", created_authenticator)), keys_expiration);

      return created_authenticator;
    },
    async getAuthenticator(credential_id: string): Promise<AdapterAuthenticator | null> {
      const authenticator_key = `${redis_namespace}:authenticator:${credential_id}`;
      let authenticator = await redis.get(authenticator_key);

      if (!authenticator) {
        const fetched_authenticator = await prisma.authenticator.findUnique({
          where: { credentialID: credential_id },
        });

        if (!fetched_authenticator) return null;

        await redis.set(authenticator_key, JSON.stringify(strip_relations("Authenticator", fetched_authenticator)), keys_expiration);
        authenticator = JSON.stringify(fetched_authenticator);
      }

      return JSON.parse(authenticator) as AdapterAuthenticator;
    },
    async listAuthenticatorsByUserId(user_id: string): Promise<AdapterAuthenticator[]> {
      return prisma.authenticator.findMany({
        where: { userId: user_id },
      });
    },
    async updateAuthenticatorCounter(credential_id: AdapterAuthenticator["credentialID"], new_counter: AdapterAuthenticator["counter"]): Promise<AdapterAuthenticator> {
      return prisma.authenticator.update({
        where: { credentialID: credential_id },
        data: { counter: new_counter },
      });
    }
  }
}

/** @see https://www.prisma.io/docs/orm/prisma-client/special-fields-and-types/null-and-undefined */
function strip_undefined<T>(obj: T) {
  const data = {} as T
  for (const key in obj) if (obj[key] !== undefined) data[key] = obj[key]
  return { data }
}

/** Remove relation fields from the data object, useful for caching */
function strip_relations<T extends Record<string, any>>(model_name: string, data: T): Partial<T> {
  if (!relation_fields[model_name]) return data;

  const filtered_data = { ...data };
  for (const field of relation_fields[model_name]) {
    delete filtered_data[field];
  }
  return filtered_data;
}