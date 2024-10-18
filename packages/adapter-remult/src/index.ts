import type {
  Adapter,
  AdapterAccount,
  AdapterUser,
  VerificationToken as VerificationTokenT,
  AdapterSession,
  AdapterAuthenticator,
} from "@auth/core/adapters"
import type { ClassType, DataProvider } from "remult"
import { remult, repo, withRemult } from "remult"
import {
  Account as local_Account,
  Authenticator as local_Authenticator,
  Session as local_Session,
  User as local_User,
  VerificationToken as local_VerificationToken,
} from "./entities.js"

import type {
  Account as TAccount,
  Authenticator as TAuthenticator,
  Session as TSession,
  User as TUser,
  VerificationToken,
} from "./entities.js"

const toAdapterUserDefault: (u?: TUser) => AdapterUser | null = (u) => {
  if (u) {
    return {
      email: u.email,
      id: u.id,
      name: u.name,
      image: u.image,
      emailVerified: u.emailVerified,
    }
  }
  return null
}

const toAdapterAccount: (a?: TAccount) => AdapterAccount | null = (a) => {
  if (a) {
    return {
      id: a.id,
      userId: a.userId,
      type: a.type,
      provider: a.provider,
      providerAccountId: a.providerAccountId,
    }
  }
  return null
}

const toAdapaterSession: (s?: TSession) => AdapterSession | null = (s) => {
  if (s) {
    return {
      id: s.id,
      userId: s.userId,
      sessionToken: s.sessionToken,
      expires: s.expires,
    }
  }
  return null
}

const toAdaptAuthenticator: (
  a?: TAuthenticator
) => AdapterAuthenticator | null = (a) => {
  if (a) {
    return {
      counter: a.counter,
      credentialID: a.credentialID,
      credentialBackedUp: a.credentialBackedUp,
      credentialDeviceType: a.credentialDeviceType,
      credentialPublicKey: a.credentialPublicKey,
      providerAccountId: a.providerAccountId,
      transports: a.transports,
      userId: a.userId,
    }
  }
  return null
}

const toVerificationToken: (
  c?: VerificationToken
) => VerificationTokenT | null = (c) => {
  if (c) {
    return {
      expires: c.expires,
      identifier: c.identifier,
      token: c.token,
    }
  }
  return null
}

export const RemultAdapter: (args: {
  dataProvider:
    | DataProvider
    | Promise<DataProvider>
    | (() => Promise<DataProvider | undefined>)
  /** Will create tables and columns in supporting databases. default: true
   *
   * @description
   * when set to true, it'll create entities that do not exist, and add columns that are missing.
   */
  ensureSchema?: boolean
  customEntities?: {
    Account?: ClassType<TAccount>
    Authenticator?: ClassType<TAuthenticator>
    Session?: ClassType<TSession>
    User?: ClassType<TUser>
    // VerificationToken?: ClassType<TVerificationToken>
  }
  userDbToSession?: (user?: TUser) => AdapterUser | null
}) => { adapter: Adapter } = (args) => {
  // Init stuff
  const Account = args?.customEntities?.Account ?? local_Account
  const Authenticator =
    args?.customEntities?.Authenticator ?? local_Authenticator
  const Session = args?.customEntities?.Session ?? local_Session
  const User = args?.customEntities?.User ?? local_User
  // const VerificationToken =
  //   args?.customEntities?.VerificationToken ?? local_VerificationToken
  const VerificationToken = local_VerificationToken

  let executeEnsureSchema = args.ensureSchema ?? true

  const toAdapterUser = args.userDbToSession ?? toAdapterUserDefault

  const entities = [Account, Authenticator, Session, User, VerificationToken]
  return {
    adapter: new Proxy(
      {
        async createVerificationToken(verificationToken) {
          return toVerificationToken(
            await repo(VerificationToken).insert(verificationToken)
          )
        },
        async useVerificationToken({ identifier, token }) {
          const v = await repo(VerificationToken).findFirst({
            identifier,
            token,
          })
          if (!v) return null
          if (v && v.identifier !== identifier) {
            return null
          }
          await repo(VerificationToken).delete({ identifier, token })
          return v!
        },
        async createUser(user: AdapterUser) {
          return await repo(User).insert(user)
        },
        async getUser(id) {
          return toAdapterUser(await repo(User).findFirst({ id }))
        },
        async getUserByEmail(email) {
          return toAdapterUser(await repo(User).findFirst({ email }))
        },
        async getUserByAccount({ providerAccountId, provider }) {
          const a = await repo(Account).findFirst(
            { provider, providerAccountId }
            // { include: { user: true } }
          )
          if (a) {
            return toAdapterUser(await repo(User).findFirst({ id: a?.userId }))
          }
          return null
        },
        async updateUser(user: Partial<AdapterUser>): Promise<AdapterUser> {
          if (user.id) {
            return toAdapterUser(await repo(User).update(user.id, user))!
          }
          return user as Promise<AdapterUser>
        },
        async linkAccount(account) {
          return toAdapterAccount(await repo(Account).insert(account))
        },
        async createSession({ sessionToken, userId, expires }) {
          if (userId === undefined) {
            throw Error(`userId is undef in createSession`)
          }
          return await repo(Session).insert({ sessionToken, userId, expires })
        },
        async getSessionAndUser(sessionToken): Promise<{
          session: AdapterSession
          user: AdapterUser
        } | null> {
          if (sessionToken === undefined) {
            return null
          }
          const session = toAdapaterSession(
            await repo(Session).findFirst({ sessionToken })
          )
          if (!session) {
            return null
          }

          const user = toAdapterUser(
            await repo(User).findFirst({ id: session.userId })
          )
          if (!user) {
            return null
          }

          return {
            session,
            user,
          }
        },
        async updateSession(
          session: Partial<AdapterSession> &
            Pick<AdapterSession, "sessionToken">
        ): Promise<AdapterSession | null | undefined> {
          const { sessionToken } = session
          const result1 = await repo(Session).findFirst({ sessionToken })
          if (!result1) {
            return null
          }
          const originalSession: AdapterSession = result1

          const newSession: AdapterSession = {
            ...originalSession,
            ...session,
          }
          await repo(Session).updateMany({
            where: { sessionToken: newSession.sessionToken },
            set: { expires: newSession.expires },
          })
          return newSession
        },
        async deleteSession(sessionToken: string) {
          await repo(Session).delete({ sessionToken })
        },
        async unlinkAccount(partialAccount) {
          const { provider, providerAccountId } = partialAccount
          await repo(Account).deleteMany({
            where: { provider, providerAccountId },
          })
        },
        async deleteUser(userId) {
          await repo(User).delete({ id: userId })
          await repo(Session).deleteMany({ where: { userId } })
          await repo(Account).deleteMany({ where: { userId } })
        },
        async createAuthenticator(authenticator) {
          return toAdaptAuthenticator(
            await repo(Authenticator).insert(authenticator)!
          )!
        },
        async getAccount(providerAccountId, provider) {
          return toAdapterAccount(
            await repo(Account).findFirst({ providerAccountId, provider })
          )
        },
        async getAuthenticator(credentialID) {
          return toAdaptAuthenticator(
            await repo(Authenticator).findFirst({ credentialID })
          )
        },
        async listAuthenticatorsByUserId(userId) {
          return (
            (await repo(Authenticator).find({ where: { userId } })).map(
              (a) => toAdaptAuthenticator(a)!
            ) ?? []
          )
        },
        async updateAuthenticatorCounter(credentialID, newCounter) {
          return toAdaptAuthenticator(
            await repo(Authenticator).update(credentialID, {
              counter: newCounter,
            })
          )!
        },
      },
      {
        get: (target: any, prop: string, receiver) => {
          return async (...args1: any[]) => {
            return withRemult(
              async () => {
                if (executeEnsureSchema) {
                  await remult.dataProvider.ensureSchema?.(
                    entities.map((x) => remult.repo(x as any).metadata)
                  )
                  executeEnsureSchema = false
                }
                if (target[prop]) {
                  return await target[prop](...args1)
                }
              },
              { dataProvider: args.dataProvider }
            )
          }
        },
      }
    ),
  }
}
