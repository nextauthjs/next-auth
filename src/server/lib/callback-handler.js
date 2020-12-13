// This function handles the complex flow of signing users in, and either creating,
// linking (or not linking) accounts depending on if the user is currently logged
// in, if they have account already and the authentication mechanism they are using.
//
// It prevents insecure behaviour, such as linking oAuth accounts unless a user is
// signed in and authenticated with an existing valid account.
//
// All verification (e.g. oAuth flows or email address verificaiton flows) are
// done prior to this handler being called to avoid additonal complexity in this
// handler.
import { AccountNotLinkedError } from '../../lib/errors'
import dispatchEvent from '../lib/dispatch-event'

export default async (sessionToken, profile, providerAccount, options) => {
  try {
    // Input validation
    if (!profile) { throw new Error('Missing profile') }
    if (!providerAccount || !providerAccount.id || !providerAccount.type) { throw new Error('Missing or invalid provider account') }

    const { adapter, jwt, events } = options

    const useJwtSession = options.session.jwt

    // If no adapter is configured then we don't have a database and cannot
    // persist data; in this mode we just return a dummy session object.
    if (!adapter) {
      return {
        user: profile,
        account: providerAccount,
        session: {}
      }
    }

    const {
      createUser,
      updateUser,
      getUser,
      getUserByProviderAccountId,
      getUserByEmail,
      linkAccount,
      createSession,
      getSession,
      deleteSession
    } = await adapter.getAdapter(options)

    let session = null
    let user = null
    let isSignedIn = null
    let isNewUser = false

    if (sessionToken) {
      if (useJwtSession) {
        try {
          session = await jwt.decode({ ...jwt, token: sessionToken })
          if (session && session.sub) {
            user = await getUser(session.sub)
            isSignedIn = !!user
          }
        } catch (e) {
          // If session can't be verified, treat as no session
        }
      } else {
        session = await getSession(sessionToken)
        if (session && session.userId) {
          user = await getUser(session.userId)
          isSignedIn = !!user
        }
      }
    }

    if (providerAccount.type === 'email') {
      // If signing in with an email, check if an account with the same email address exists already
      const userByEmail = profile.email ? await getUserByEmail(profile.email) : null
      if (userByEmail) {
        // If they are not already signed in as the same user, this flow will
        // sign them out of the current session and sign them in as the new user
        if (isSignedIn) {
          if (user.id !== userByEmail.id && !useJwtSession) {
            // Delete existing session if they are currently signed in as another user.
            // This will switch user accounts for the session in cases where the user was
            // already logged in with a different account.
            await deleteSession(sessionToken)
          }
        }

        // Update emailVerified property on the user object
        const currentDate = new Date()
        user = await updateUser({ ...userByEmail, emailVerified: currentDate })
        await dispatchEvent(events.updateUser, user)
      } else {
        // Create user account if there isn't one for the email address already
        const currentDate = new Date()
        user = await createUser({ ...profile, emailVerified: currentDate })
        await dispatchEvent(events.createUser, user)
        isNewUser = true
      }

      // Create new session
      session = useJwtSession ? {} : await createSession(user)

      return {
        session,
        user,
        isNewUser
      }
    } else if (providerAccount.type === 'oauth') {
      // If signing in with oauth account, check to see if the account exists already
      const userByProviderAccountId = await getUserByProviderAccountId(providerAccount.provider, providerAccount.id)
      if (userByProviderAccountId) {
        if (isSignedIn) {
          // If the user is already signed in with this account, we don't need to do anything
          // Note: These are cast as strings here to ensure they match as in
          // some flows (e.g. JWT with a database) one of the values might be a
          // string and the other might be an ObjectID and would otherwise fail.
          if (`${userByProviderAccountId.id}` === `${user.id}`) {
            return {
              session,
              user,
              isNewUser
            }
          } else {
            // If the user is currently signed in, but the new account they are signing in
            // with is already associated with another account, then we cannot link them
            // and need to return an error.
            throw new AccountNotLinkedError()
          }
        } else {
          // If there is no active session, but the account being signed in with is already
          // associated with a valid user then create session to sign the user in.
          session = useJwtSession ? {} : await createSession(userByProviderAccountId)
          return {
            session,
            user: userByProviderAccountId,
            isNewUser
          }
        }
      } else {
        if (isSignedIn) {
          // If the user is already signed in and the oAuth account isn't already associated
          // with another user account then we can go ahead and link the accounts safely.
          await linkAccount(
            user.id,
            providerAccount.provider,
            providerAccount.type,
            providerAccount.id,
            providerAccount.refreshToken,
            providerAccount.accessToken,
            providerAccount.accessTokenExpires
          )
          await dispatchEvent(events.linkAccount, { user, providerAccount })

          // As they are already signed in, we don't need to do anything after linking them
          return {
            session,
            user,
            isNewUser
          }
        }

        // If the user is not signed in and it looks like a new oAuth account then we
        // check there also isn't an user account already associated with the same
        // email address as the one in the oAuth profile.
        //
        // This step is often overlooked in oAuth implementations, but covers the following cases:
        //
        // 1. It makes it harder for someone to accidentally create two accounts.
        //    e.g. by signin in with email, then again with an oauth account connected to the same email.
        // 2. It makes it harder to hijack a user account using a 3rd party oAuth account.
        //    e.g. by creating an oauth account then changing the email address associated with it.
        //
        // It's quite common for services to automatically link accounts in this case, but it's
        // better practice to require the user to sign in *then* link accounts to be sure
        // someone is not exploiting a problem with a third party oAuth service.
        //
        // oAuth providers should require email address verification to prevent this, but in
        // practice that is not always the case; this helps protect against that.
        const userByEmail = profile.email ? await getUserByEmail(profile.email) : null
        if (userByEmail) {
          // We end up here when we don't have an account with the same [provider].id *BUT*
          // we do already have an account with the same email address as the one in the
          // oAuth profile the user has just tried to sign in with.
          //
          // We don't want to have two accounts with the same email address, and we don't
          // want to link them in case it's not safe to do so, so instead we prompt the user
          // to sign in via email to verify their identity and then link the accounts.
          throw new AccountNotLinkedError()
        } else {
          // If the current user is not logged in and the profile isn't linked to any user
          // accounts (by email or provider account id)...
          //
          // If no account matching the same [provider].id or .email exists, we can
          // create a new account for the user, link it to the oAuth acccount and
          // create a new session for them so they are signed in with it.
          user = await createUser(profile)
          await dispatchEvent(events.createUser, user)

          await linkAccount(
            user.id,
            providerAccount.provider,
            providerAccount.type,
            providerAccount.id,
            providerAccount.refreshToken,
            providerAccount.accessToken,
            providerAccount.accessTokenExpires
          )
          await dispatchEvent(events.linkAccount, { user, providerAccount })

          session = useJwtSession ? {} : await createSession(user)
          isNewUser = true
          return {
            session,
            user,
            isNewUser
          }
        }
      }
    } else {
      return Promise.reject(new Error('Provider not supported'))
    }
  } catch (error) {
    return Promise.reject(error)
  }
}
