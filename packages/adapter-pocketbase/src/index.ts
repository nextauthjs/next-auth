import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/src/adapters"
import {
  type PocketBaseAccount,
  type PocketBaseSession,
  type PocketBaseUser,
  type PocketBaseVerificationToken,
  format,
  adminLogin,
} from "./pocketbase.helpers"
import type Pocketbase from "pocketbase"

export const PocketBaseAdapter = (
  client: Pocketbase,
  options: { username: string; password: string }
): Adapter => {
  return {
    async createUser(user) {
      let pb_user: any

      try {
        await adminLogin(client, options)

        pb_user = await client
          .collection("next_auth_user")
          .create<PocketBaseUser>({
            name: user.name,
            image: user.image,
            email: user.email,
            emailVerified: user.emailVerified?.toISOString().replace("T", " "),
          })
      } catch (_) {
        throw new Error("error creating user - see pocketbase logs")
      }

      if (pb_user.code)
        throw new Error("error creating user in database - see pocketbase logs")

      return format<AdapterUser>(pb_user)
    },
    async getUser(id) {
      let pb_user: any

      try {
        await adminLogin(client, options)

        pb_user = await client
          .collection("next_auth_user")
          .getOne<PocketBaseUser>(id)
      } catch (_) {
        return null
      }

      if (pb_user.code)
        throw new Error(
          "error getting user from database - see pocketbase logs"
        )

      return format<AdapterUser>(pb_user)
    },
    async getUserByEmail(email) {
      let pb_user: any

      try {
        await adminLogin(client, options)

        pb_user = await client
          .collection("next_auth_user")
          .getFirstListItem<PocketBaseUser>(`email="${email}"`)
      } catch (_) {
        return null
      }

      if (pb_user.code)
        throw new Error(
          "error getting user from database using email filter - see pocketbase logs"
        )

      return format<AdapterUser>(pb_user)
    },
    async getUserByAccount({ providerAccountId, provider }) {
      let pb_account: any
      let pb_user: any

      try {
        await adminLogin(client, options)

        pb_account = await client
          .collection("next_auth_account")
          .getFirstListItem<PocketBaseAccount>(
            `provider="${provider}" && providerAccountId="${providerAccountId}"`
          )
      } catch (_) {
        return null
      }

      if (pb_account.code)
        throw new Error(
          "error getting user from database by account filter - see pocketbase logs"
        )

      try {
        pb_user = await client
          .collection("next_auth_user")
          .getOne<PocketBaseUser>(pb_account.userId)
      } catch (_) {
        throw new Error(
          "error getting user within account filter function - see pocketbase logs"
        )
      }
      if (pb_user.code)
        throw new Error(
          "error getting user from database within account filter function - see pocketbase logs"
        )

      return format<AdapterUser>(pb_user)
    },
    async updateUser(user) {
      let pb_user: any

      try {
        await adminLogin(client, options)

        pb_user = await client
          .collection("next_auth_user")
          .update<PocketBaseUser>(user.id as string, {
            name: user.name,
            image: user.image,
            email: user.email,
            email_verified: user.emailVerified?.toISOString().replace("T", " "),
          })
      } catch (_) {
        throw new Error("error updating user - see pocketbase logs")
      }

      if (pb_user.code)
        throw new Error("error updating user in database - see pocketbase logs")

      return format<AdapterUser>(pb_user)
    },
    async linkAccount(account) {
      let pb_account: any

      try {
        await adminLogin(client, options)

        pb_account = await client
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
      } catch (_) {
        throw new Error(
          "error creating account in database - see pocketbase logs"
        )
      }

      if (pb_account.code)
        throw new Error(
          "error linking account in database - see pocketbase logs"
        )

      return format<AdapterAccount>(pb_account)
    },
    async createSession(session) {
      let pb_session: any

      try {
        await adminLogin(client, options)

        pb_session = await client
          .collection("next_auth_session")
          .create<PocketBaseSession>({
            expires: session.expires.toISOString().replace("T", " "),
            sessionToken: session.sessionToken,
            userId: session.userId,
          })
      } catch (error) {
        throw new Error(
          "error creating session in database - see pocketbase logs"
        )
      }
      if (pb_session.code)
        throw new Error(
          "error creating session in database - see pocketbase logs"
        )

      return format<AdapterSession>(pb_session)
    },
    async getSessionAndUser(sessionToken) {
      let pb_session: any

      try {
        await adminLogin(client, options)

        pb_session = await client
          .collection("next_auth_session")
          .getFirstListItem<PocketBaseSession>(`sessionToken="${sessionToken}"`)
      } catch (_) {
        return null
      }

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
    },
    async updateSession(session) {
      let record: any
      let pb_session: any

      try {
        await adminLogin(client, options)

        record = await client
          .collection("next_auth_session")
          .getFirstListItem<PocketBaseSession>(
            `sessionToken="${session.sessionToken}"`
          )
      } catch (_) {
        return null
      }

      try {
        pb_session = await client
          .collection("next_auth_session")
          .update<PocketBaseSession>(record.id, {
            expires: session.expires?.toISOString().replace("T", " "),
            sessionToken: session.sessionToken,
            userId: session.userId,
          })
      } catch (_) {
        return null
      }

      if (pb_session.code)
        throw new Error(
          "error updating session in database - see pocketbase logs"
        )

      return format<AdapterSession>(pb_session)
    },
    async deleteSession(sessionToken) {
      let record: any

      try {
        await adminLogin(client, options)

        record = await client
          .collection("next_auth_session")
          .getFirstListItem<PocketBaseSession>(`sessionToken="${sessionToken}"`)
      } catch (_) {
        return null
      }

      await client.collection("next_auth_session").delete(record.id)
    },
    async createVerificationToken(verificationToken) {
      let pb_veriToken: any

      try {
        await adminLogin(client, options)

        pb_veriToken = await client
          .collection("next_auth_verificationToken")
          .create<PocketBaseVerificationToken>({
            identifier: verificationToken.identifier,
            token: verificationToken.token,
            expires: verificationToken.expires.toISOString().replace("T", " "),
          })
      } catch (_) {
        return null
      }

      if (pb_veriToken.code)
        throw new Error(
          "error creating verificationToken in database - see pocketbase logs"
        )

      return format<VerificationToken>(pb_veriToken)
    },
    async useVerificationToken({ identifier, token }) {
      let pb_veriToken: any
      try {
        await adminLogin(client, options)

        pb_veriToken = await client
          .collection("next_auth_verificationToken")
          .getFirstListItem<PocketBaseVerificationToken>(
            `identifier="${identifier}" && token="${token}"`
          )
      } catch (_) {
        return null
      }

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

export { PocketBaseAdapter as default }
