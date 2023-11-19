import { OAuthAccountNotLinked } from "../../../errors.js"
import { fromDate } from "../../utils/date.js"

import type {
  AdapterAccount,
  AdapterSession,
  AdapterUser,
} from "../../../adapters.js"
import type { Account, InternalOptions, User } from "../../../types.js"
import type { JWT } from "../../../jwt.js"
import type { OAuthConfig } from "../../../providers/index.js"
import type { SessionToken } from "../../utils/cookie.js"

/**
 * This function handles the complex flow of signing users in, and either creating,
 * linking (or not linking) accounts depending on if the user is currently logged
 * in, if they have account already and the authentication mechanism they are using.
 *
 * It prevents insecure behaviour, such as linking OAuth accounts unless a user is
 * signed in and authenticated with an existing valid account.
 *
 * All verification (e.g. OAuth flows or email address verification flows) are
 * done prior to this handler being called to avoid additional complexity in this
 * handler.
 */
export async function handleLoginOrRegister(
  sessionToken: SessionToken,
  _profile: User | AdapterUser | { email: string },
  _account: AdapterAccount | Account | null,
  options: InternalOptions
) {
  // Input validation
  if (!_account?.providerAccountId || !_account.type)
    throw new Error("Missing or invalid provider account")
  if (!["email", "oauth", "oidc"].includes(_account.type))
    throw new Error("Provider not supported")

  const {
    adapter,
    jwt,
    events,
    session: { strategy: sessionStrategy, generateSessionToken },
  } = options

  // If no adapter is configured then we don't have a database and cannot
  // persist data; in this mode we just return a dummy session object.
  if (!adapter) {
    return { user: _profile as User, account: _account as Account }
  }

  const profile = _profile as AdapterUser
  let account = _account as AdapterAccount

  const {
    createUser,
    updateUser,
    getUser,
    getUserByAccount,
    getUserByEmail,
    linkAccount,
    createSession,
    getSessionAndUser,
    deleteSession,
  } = adapter

  let session: AdapterSession | JWT | null = null
  let user: AdapterUser | null = null
  let isNewUser = false

  const useJwtSession = sessionStrategy === "jwt"

  if (sessionToken) {
    if (useJwtSession) {
      try {
        const salt = options.cookies.sessionToken.name
        session = await jwt.decode({ ...jwt, token: sessionToken, salt })
        if (session && "sub" in session && session.sub) {
          user = await getUser(session.sub)
        }
      } catch {
        // If session can't be verified, treat as no session
      }
    } else {
      const userAndSession = await getSessionAndUser(sessionToken)
      if (userAndSession) {
        session = userAndSession.session
        user = userAndSession.user
      }
    }
  }

  if (account.type === "email") {
    // If signing in with an email, check if an account with the same email address exists already
    const userByEmail = await getUserByEmail(profile.email)
    if (userByEmail) {
      // If they are not already signed in as the same user, this flow will
      // sign them out of the current session and sign them in as the new user
      if (user?.id !== userByEmail.id && !useJwtSession && sessionToken) {
        // Delete existing session if they are currently signed in as another user.
        // This will switch user accounts for the session in cases where the user was
        // already logged in with a different account.
        await deleteSession(sessionToken)
      }

      // Update emailVerified property on the user object
      user = await updateUser({ id: userByEmail.id, emailVerified: new Date() })
      await events.updateUser?.({ user })
    } else {
      const { id: _, ...newUser } = { ...profile, emailVerified: new Date() }
      // Create user account if there isn't one for the email address already
      user = await createUser(newUser)
      await events.createUser?.({ user })
      isNewUser = true
    }

    // Create new session
    session = useJwtSession
      ? {}
      : await createSession({
          sessionToken: generateSessionToken(),
          userId: user.id,
          expires: fromDate(options.session.maxAge),
        })

    return { session, user, isNewUser }
  }

  // If signing in with OAuth account, check to see if the account exists already
  const userByAccount = await getUserByAccount({
    providerAccountId: account.providerAccountId,
    provider: account.provider,
  })
  if (userByAccount) {
    if (user) {
      // If the user is already signed in with this account, we don't need to do anything
      if (userByAccount.id === user.id) {
        return { session, user, isNewUser }
      }
      // If the user is currently signed in, but the new account they are signing in
      // with is already associated with another user, then we cannot link them
      // and need to return an error.
      throw new OAuthAccountNotLinked(
        "The account is already associated with another user",
        { provider: account.provider }
      )
    }
    // If there is no active session, but the account being signed in with is already
    // associated with a valid user then create session to sign the user in.
    session = useJwtSession
      ? {}
      : await createSession({
          sessionToken: generateSessionToken(),
          userId: userByAccount.id,
          expires: fromDate(options.session.maxAge),
        })

    return { session, user: userByAccount, isNewUser }
  } else {
    const { provider: p } = options as InternalOptions<"oauth" | "oidc">
    const { type, provider, providerAccountId, userId, ...tokenSet } = account
    const defaults = { providerAccountId, provider, type, userId }
    account = Object.assign(p.account(tokenSet) ?? {}, defaults)

    if (user) {
      // If the user is already signed in and the OAuth account isn't already associated
      // with another user account then we can go ahead and link the accounts safely.
      await linkAccount({ ...account, userId: user.id })
      await events.linkAccount?.({ user, account, profile })

      // As they are already signed in, we don't need to do anything after linking them
      return { session, user, isNewUser }
    }

    // If the user is not signed in and it looks like a new OAuth account then we
    // check there also isn't an user account already associated with the same
    // email address as the one in the OAuth profile.
    //
    // This step is often overlooked in OAuth implementations, but covers the following cases:
    //
    // 1. It makes it harder for someone to accidentally create two accounts.
    //    e.g. by signin in with email, then again with an oauth account connected to the same email.
    // 2. It makes it harder to hijack a user account using a 3rd party OAuth account.
    //    e.g. by creating an oauth account then changing the email address associated with it.
    //
    // It's quite common for services to automatically link accounts in this case, but it's
    // better practice to require the user to sign in *then* link accounts to be sure
    // someone is not exploiting a problem with a third party OAuth service.
    //
    // OAuth providers should require email address verification to prevent this, but in
    // practice that is not always the case; this helps protect against that.
    const userByEmail = profile.email
      ? await getUserByEmail(profile.email)
      : null
    if (userByEmail) {
      const provider = options.provider as OAuthConfig<any>
      if (provider?.allowDangerousEmailAccountLinking) {
        // If you trust the oauth provider to correctly verify email addresses, you can opt-in to
        // account linking even when the user is not signed-in.
        user = userByEmail
      } else {
        // We end up here when we don't have an account with the same [provider].id *BUT*
        // we do already have an account with the same email address as the one in the
        // OAuth profile the user has just tried to sign in with.
        //
        // We don't want to have two accounts with the same email address, and we don't
        // want to link them in case it's not safe to do so, so instead we prompt the user
        // to sign in via email to verify their identity and then link the accounts.
        throw new OAuthAccountNotLinked(
          "Another account already exists with the same e-mail address",
          { provider: account.provider }
        )
      }
    } else {
      // If the current user is not logged in and the profile isn't linked to any user
      // accounts (by email or provider account id)...
      //
      // If no account matching the same [provider].id or .email exists, we can
      // create a new account for the user, link it to the OAuth account and
      // create a new session for them so they are signed in with it.
      const { id: _, ...newUser } = { ...profile, emailVerified: null }
      user = await createUser(newUser)
    }
    await events.createUser?.({ user })

    await linkAccount({ ...account, userId: user.id })
    await events.linkAccount?.({ user, account, profile })

    session = useJwtSession
      ? {}
      : await createSession({
          sessionToken: generateSessionToken(),
          userId: user.id,
          expires: fromDate(options.session.maxAge),
        })

    return { session, user, isNewUser: true }
  }
}
