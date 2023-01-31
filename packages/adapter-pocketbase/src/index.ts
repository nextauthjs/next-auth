import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "@auth/core/src/adapters"
import type Pocketbase from "pocketbase"
import type {
  loginOpts,
  PocketBaseAccount,
  PocketBaseSession,
  PocketBaseUser,
  PocketBaseVerificationToken,
} from "./pocketbase.types"
import { adminLogin, checkCollections, format } from "./pocketbase.helpers"

export const PocketbaseAdapter = (
  client: Pocketbase,
  options: loginOpts
): Adapter => {
  return {
    async createUser(user) {
      try {
        await checkCollections(client, options)

        const pb_user = await client
          .collection("next_auth_user")
          .create<PocketBaseUser>({
            name: user.name,
            image: user.image,
            email: user.email,
            emailVerified: user.emailVerified?.toISOString().replace("T", " "),
          })

        if (pb_user.code)
          throw new Error(
            "error creating user in database - see pocketbase logs"
          )

        return format<AdapterUser>(pb_user)
      } catch (_) {
        throw new Error("error creating user - see pocketbase logs")
      }
    },
    async getUser(id) {
      try {
        await adminLogin(client, options)

        const pb_user = await client
          .collection("next_auth_user")
          .getOne<PocketBaseUser>(id)

        if (pb_user.code)
          throw new Error(
            "error getting user from database - see pocketbase logs"
          )

        return format<AdapterUser>(pb_user)
      } catch (_) {
        return null
      }
    },
    async getUserByEmail(email) {
      try {
        await adminLogin(client, options)

        const pb_user = await client
          .collection("next_auth_user")
          .getFirstListItem<PocketBaseUser>(`email="${email}"`)

        if (pb_user.code)
          throw new Error(
            "error getting user from database using email filter - see pocketbase logs"
          )

        return format<AdapterUser>(pb_user)
      } catch (_) {
        return null
      }
    },
    async getUserByAccount({ providerAccountId, provider }) {
      try {
        await adminLogin(client, options)

        const pb_account = await client
          .collection("next_auth_account")
          .getFirstListItem<PocketBaseAccount>(
            `provider="${provider}" && providerAccountId="${providerAccountId}"`
          )

        if (pb_account.code)
          throw new Error(
            "error getting user from database by account filter - see pocketbase logs"
          )

        const pb_user = await client
          .collection("next_auth_user")
          .getOne<PocketBaseUser>(pb_account.userId)

        if (pb_user.code)
          throw new Error(
            "error getting user from database within account filter function - see pocketbase logs"
          )

        return format<AdapterUser>(pb_user)
      } catch (_) {
        return null
      }
    },
    async updateUser(user) {
      try {
        await adminLogin(client, options)

        const pb_user = await client
          .collection("next_auth_user")
          .update<PocketBaseUser>(user.id as string, {
            name: user.name,
            image: user.image,
            email: user.email,
            email_verified: user.emailVerified?.toISOString().replace("T", " "),
          })
        if (pb_user.code)
          throw new Error(
            "error updating user in database - see pocketbase logs"
          )

        return format<AdapterUser>(pb_user)
      } catch (_) {
        throw new Error("error updating user - see pocketbase logs")
      }
    },
    async linkAccount(account) {
      try {
        await checkCollections(client, options)

        const pb_account = await client
          .collection("next_auth_account")
          .create<PocketBaseAccount>({
            userId: account.userId,
            type: account.type,
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            access_token: account.access_token,
            id_token: account.id_token,
            token_type: account.token_type,
            refresh_token: account.refresh_token,
            scope: account.scope,
            session_state: account.session_state,
            expires_at: Number(account.expires_at),
          })

        if (pb_account.code)
          throw new Error(
            "error linking account in database - see pocketbase logs"
          )

        return format<AdapterAccount>(pb_account)
      } catch (_) {
        throw new Error(
          "error creating account in database - see pocketbase logs"
        )
      }
    },
    async createSession(session) {
      try {
        await checkCollections(client, options)

        const pb_session = await client
          .collection("next_auth_session")
          .create<PocketBaseSession>({
            expires: session.expires.toISOString().replace("T", " "),
            sessionToken: session.sessionToken,
            userId: session.userId,
          })

        if (pb_session.code)
          throw new Error(
            "error creating session in database - see pocketbase logs"
          )

        return format<AdapterSession>(pb_session)
      } catch (error) {
        throw new Error(
          "error creating session in database - see pocketbase logs"
        )
      }
    },
    async getSessionAndUser(sessionToken) {
      try {
        await adminLogin(client, options)

        const pb_session = await client
          .collection("next_auth_session")
          .getFirstListItem<PocketBaseSession>(`sessionToken="${sessionToken}"`)

        if (pb_session.code)
          throw new Error(
            "error retrieving session from database - see pocketbase logs"
          )

        const pb_user = await client
          .collection("next_auth_user")
          .getOne<PocketBaseUser>(pb_session.userId)

        if (pb_user.code)
          throw new Error(
            "error getting user from database within getSessionAndUser func - see pocketbase logs"
          )

        const session = format<AdapterSession>(pb_session)
        const user = format<AdapterUser>(pb_user)
        return {
          session,
          user,
        }
      } catch (_) {
        return null
      }
    },
    async updateSession(session) {
      try {
        await adminLogin(client, options)

        const record = await client
          .collection("next_auth_session")
          .getFirstListItem<PocketBaseSession>(
            `sessionToken="${session.sessionToken}"`
          )

        const pb_session = await client
          .collection("next_auth_session")
          .update<PocketBaseSession>(record.id, {
            expires: session.expires?.toISOString().replace("T", " "),
            sessionToken: session.sessionToken,
            userId: session.userId,
          })

        if (pb_session.code)
          throw new Error(
            "error updating session in database - see pocketbase logs"
          )

        return format<AdapterSession>(pb_session)
      } catch (_) {
        return null
      }
    },
    async deleteSession(sessionToken) {
      try {
        await adminLogin(client, options)

        const record = await client
          .collection("next_auth_session")
          .getFirstListItem<PocketBaseSession>(`sessionToken="${sessionToken}"`)

        await client.collection("next_auth_session").delete(record.id)
      } catch (_) {
        return null
      }
    },
    async createVerificationToken(verificationToken) {
      try {
        await checkCollections(client, options)

        const pb_veriToken = await client
          .collection("next_auth_verificationToken")
          .create<PocketBaseVerificationToken>({
            identifier: verificationToken.identifier,
            token: verificationToken.token,
            expires: verificationToken.expires.toISOString().replace("T", " "),
          })

        if (pb_veriToken.code)
          throw new Error(
            "error creating verificationToken in database - see pocketbase logs"
          )

        return format<VerificationToken>(pb_veriToken)
      } catch (_) {
        return null
      }
    },
    async useVerificationToken({ identifier, token }) {
      try {
        await adminLogin(client, options)

        const pb_veriToken = await client
          .collection("next_auth_verificationToken")
          .getFirstListItem<PocketBaseVerificationToken>(
            `identifier="${identifier}" && token="${token}"`
          )

        if (pb_veriToken.code)
          throw new Error(
            "error finding verification Token within database - see pocketbase logs"
          )

        const success = await client
          .collection("next_auth_verificationToken")
          .delete(pb_veriToken.id)

        if (success) {
          // @ts-expect-error internal id's are not to be returned with the rest of the token
          const { id, ...returnVal } = format<VerificationToken>(pb_veriToken)
          return returnVal
        } else {
          throw new Error(
            "unable to delete verificationToken from database - see pocketbase logs"
          )
        }
      } catch (_) {
        return null
      }
    },
    async deleteUser(userId) {
      await adminLogin(client, options)

      await client
        .collection("next_auth_user")
        .delete(userId)
        .catch((_) => null)
    },
    async unlinkAccount({ provider, providerAccountId }) {
      try {
        await adminLogin(client, options)

        const pb_account = await client
          .collection("next_auth_account")
          .getFirstListItem<PocketBaseAccount>(
            `providerAccountId="${providerAccountId} && provider=${provider}"`
          )

        await client
          .collection("next_auth_account")
          .delete(pb_account.id)
          .then((_) => null)
      } catch (_) {
        return null
      }
    },
  }
}

export { PocketbaseAdapter as default }
