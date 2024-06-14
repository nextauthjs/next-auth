import {
  AdapterUser,
  AdapterAccount,
  AdapterSession,
  VerificationToken,
} from "@auth/core/adapters"
import { RecordId } from "surrealdb.js"
import {
  UserDoc,
  extractId,
  AccountDoc,
  SessionDoc,
  VerificationTokenDoc,
} from "./index.js"

/** @internal */
// Convert DB object to AdapterUser
export function docToUser(doc: UserDoc): AdapterUser {
  return {
    ...doc,
    id: extractId(doc.id),
  }
}

/** @internal */
// Convert DB object to AdapterAccount
export function docToAccount(doc: AccountDoc): AdapterAccount {
  return {
    ...doc,
    id: extractId(doc.id),
    userId: extractId(doc.userId),
  }
}

/** @internal */
// Convert DB object to AdapterSession
export function docToSession(doc: SessionDoc<RecordId>): AdapterSession {
  const { id, ...rest } = doc
  return {
    ...rest,
    userId: extractId(doc.userId),
  }
}

/** @internal */
// Convert AdapterUser to DB object
export function userToDoc(user: AdapterUser) {
  return {
    ...user,
    id: new RecordId("user", user.id),
  }
}

/** @internal */
// Convert AdapterAccount to DB object
export function accountToDoc(account: AdapterAccount) {
  return {
    ...account,
    userId: new RecordId("user", account.userId),
  }
}

/** @internal */
// Convert AdapterSession to DB object
export function sessionToDoc(session: AdapterSession) {
  return {
    ...session,
    userId: new RecordId("user", session.userId),
  }
}

/** @internal */
// Convert VerificationToken to DB object
export function verificationTokenToDoc(
  token: VerificationToken
): VerificationTokenDoc {
  return {
    ...token,
    id: new RecordId("verification_token", {
      token: token.token,
      identifier: token.identifier,
    }),
  }
}

/** @internal */
// Convert DB object to VerificationToken
export function docToVerificationToken(
  doc: VerificationTokenDoc
): VerificationToken {
  const { id, ...rest } = doc
  return rest
}
