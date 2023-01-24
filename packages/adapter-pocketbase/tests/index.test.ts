import { runBasicTests } from "@next-auth/adapter-test"
import { PocketBaseAdapter } from "../src"
import type {
  AdapterAccount,
  VerificationToken,
  AdapterUser,
  AdapterSession,
} from "next-auth/src/adapters"
import {
  PocketBaseAccount,
  PocketBaseSession,
  PocketBaseUser,
  PocketBaseVerificationToken,
} from "../src/pocketbase.types"

import "cross-fetch/polyfill"

import Pocketbase from "pocketbase"
const pb = new Pocketbase("http://127.0.0.1:8090")

runBasicTests({
  adapter: PocketBaseAdapter(pb),
  db: {
    async session(sessionToken) {
      let pb_session: any
      try {
        pb_session = await pb
          .collection("next_auth_session")
          .getFirstListItem<PocketBaseSession>(`sessionToken="${sessionToken}"`)
      } catch (_) {
        return null
      }

      if (pb_session.sessionToken !== sessionToken)
        throw new Error("sessionToken mismatch")

      const result: AdapterSession = {
        userId: pb_session.userId,
        sessionToken: pb_session.sessionToken,
        // @ts-ignore
        id: pb_session.id as string,
        expires: new Date(pb_session.expires),
      }

      return result
    },
    async user(id) {
      let pb_user: any
      try {
        pb_user = await pb
          .collection("next_auth_user")
          .getOne<PocketBaseUser>(id)
      } catch (_) {
        return null
      }
      if (pb_user.code) throw new Error("could not find user")

      const result: AdapterUser = {
        id: pb_user.id as string,
        name: pb_user.name,
        email: pb_user.email,
        image: pb_user.image,
        emailVerified: new Date(pb_user.emailVerified),
      }

      return result
    },
    async account({ provider, providerAccountId }) {
      let pb_account: any
      try {
        pb_account = await pb
          .collection("next_auth_account")
          .getFirstListItem<PocketBaseAccount>(
            `provider="${provider}" && providerAccountId="${providerAccountId}"`
          )
      } catch (_) {
        return null
      }

      if (pb_account.code) throw new Error("could not find account")

      const result: AdapterAccount = {
        userId: pb_account.userId,
        id: pb_account.id,
        provider: pb_account.provider,
        providerAccountId: pb_account.providerAccountId,
        access_token: pb_account.access_token,
        id_token: pb_account.id_token,
        refresh_token: pb_account.refresh_token,
        scope: pb_account.scope,
        session_state: pb_account.session_state,
        token_type: pb_account.token_type,
        expires_at: Number(pb_account.expires_at),
        // @ts-ignore this return type is safe
        type: pb_account.type,
      }

      return result
    },
    async verificationToken({ identifier, token }) {
      let pb_veriToken: any
      try {
        pb_veriToken = await pb
          .collection("next_auth_verificationToken")
          .getFirstListItem<PocketBaseVerificationToken>(
            `identifier="${identifier}" && token="${token}"`
          )
      } catch (_) {
        return null
      }

      if (pb_veriToken.code) throw new Error("could not get verificationToken")

      const result: VerificationToken = {
        token: pb_veriToken.token,
        identifier: pb_veriToken.identifier,
        expires: new Date(pb_veriToken.expires),
      }

      return result
    },
  },
})