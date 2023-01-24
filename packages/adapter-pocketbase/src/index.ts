import type {
  Adapter,
  AdapterAccount,
  AdapterSession,
  AdapterUser,
  VerificationToken,
} from "next-auth/src/adapters"
import type {
  PocketBaseAccount,
  PocketBaseSession,
  PocketBaseUser,
  PocketBaseVerificationToken,
} from "./pocketbase.types"
import type Pocketbase from "pocketbase"

export const PocketBaseAdapter = (
  client: Pocketbase,
  options = {}
): Adapter => {
  return {
    async createUser(user) {
      let pb_user: any

      try {
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

      const returnVal: AdapterUser = {
        id: pb_user.id,
        name: pb_user.name,
        email: pb_user.email,
        emailVerified: new Date(pb_user.emailVerified),
      }

      return returnVal
    },
    async getUser(id) {
      let pb_user: any

      try {
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

      const returnVal: AdapterUser = {
        id: pb_user.id as string,
        email: pb_user.email,
        emailVerified: new Date(pb_user.emailVerified),
        name: pb_user.name,
        image: pb_user.image,
      }

      return returnVal
    },
    async getUserByEmail(email) {
      let pb_user: any

      try {
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

      const returnVal: AdapterUser = {
        id: pb_user.id as string,
        email: pb_user.email,
        image: pb_user.image,
        name: pb_user.name,
        emailVerified: new Date(pb_user.emailVerified),
      }

      return returnVal
    },
    async getUserByAccount({ providerAccountId, provider }) {
      let pb_account: any
      let pb_user: any

      try {
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

      const returnVal: AdapterUser = {
        id: pb_user.id,
        email: pb_user.email,
        image: pb_user.image,
        name: pb_user.name,
        emailVerified: new Date(pb_user.emailVerified),
      }

      return returnVal
    },
    async updateUser(user) {
      let pb_user: any

      try {
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

      const returnVal: AdapterUser = {
        id: pb_user.id,
        email: pb_user.email,
        image: pb_user.image,
        name: pb_user.name,
        emailVerified: new Date(pb_user.emailVerified),
      }

      return returnVal
    },
    async linkAccount(account) {
      let pb_account: any

      try {
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

      const returnVal: AdapterAccount = {
        id: pb_account.id,
        userId: pb_account.userId,
        provider: pb_account.provider,
        providerAccountId: pb_account.providerAccountId,
        access_token: pb_account.access_token,
        id_token: pb_account.id_token,
        refresh_token: pb_account.refresh_token,
        scope: pb_account.scope,
        session_state: pb_account.session_state,
        token_type: pb_account.token_type,
        expires_at: Number(pb_account.expires_at),
        type: pb_account.type,
      }

      return returnVal
    },
    async createSession(session) {
      let pb_session: any

      try {
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

      return {
        sessionToken: pb_session.sessionToken,
        userId: pb_session.userId,
        expires: new Date(pb_session.expires),
      }
    },
    async getSessionAndUser(sessionToken) {
      let pb_session: any

      try {
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

      const session: AdapterSession = {
        expires: new Date(pb_session.expires),
        userId: pb_user.id,
        sessionToken: pb_session.sessionToken,
        // @ts-expect-error
        id: pb_session.id as string,
      }

      const user: AdapterUser = {
        id: pb_user.id,
        email: pb_user.email,
        image: pb_user.image,
        name: pb_user.name,
        emailVerified: new Date(pb_user.emailVerified),
      }

      return {
        session,
        user,
      }
    },
    async updateSession(session) {
      let record: any
      let pb_session: any

      try {
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

      const returnVal: AdapterSession = {
        sessionToken: pb_session.sessionToken,
        userId: pb_session.userId,
        expires: new Date(pb_session.expires),
      }

      return returnVal
    },
    async deleteSession(sessionToken) {
      let record: any

      try {
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

      const returnVal: VerificationToken = {
        token: pb_veriToken.token,
        identifier: pb_veriToken.identifier,
        expires: new Date(pb_veriToken.expires),
      }

      return returnVal
    },
    async useVerificationToken({ identifier, token }) {
      let pb_veriToken: any
      try {
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
        const returnVal: VerificationToken = {
          token: pb_veriToken.token,
          identifier: pb_veriToken.identifier,
          expires: new Date(pb_veriToken.expires),
        }

        return returnVal
      } else {
        throw new Error(
          "unable to delete verificationToken from database - see pocketbase logs"
        )
      }
    },
  }
}

export { PocketBaseAdapter as default }
