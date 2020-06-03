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
import { randomBytes } from 'crypto'
import jwt from 'jsonwebtoken'
import { AccountNotLinkedError, InvalidProfile } from '../../lib/errors'

export default async (sessionToken, profile, providerAccount, options) => {
  try {
    // Input validation
    if (!profile) { throw new Error('Missing profile') }
    if (!providerAccount || !providerAccount.id || !providerAccount.type) { throw new Error('Missing or invalid provider account') }

    const { adapter, jwt: useJwt, jwtSecret, sessionMaxAge } = options

    const {
      createUser,
      getUser,
      getUserByProviderAccountId,
      getUserByEmail,
      // getUserByCredentials, // @TODO Support 'credentials' auth flow
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
      if (useJwt) {
        try {
          session = jwt.verify(sessionToken, jwtSecret, { maxAge: sessionMaxAge })
          isSignedIn = !!session
          if (isSignedIn) {
            user = await getUser(session.nextauth.user.id)
          }
        } catch (e) {
          // If session can't be verified, treat as no session
        }
      } else {
        session = await getSession(sessionToken)
        isSignedIn = !!session
        if (isSignedIn) {
          user = await getUser(session.userId)
        }
      }
    }

    if (providerAccount.type === 'email') {
      // All new email accounts need an email address associated with the profile
      if (!profile.email) { throw new InvalidProfile() }

      // If signing in with an email, check if an account with the same email address exists already
      const userByEmail = await getUserByEmail(profile.email)
      if (userByEmail) {
        if (isSignedIn) {
          if (user.id === userByEmail.id) {
            // If they are already signed in with this account,
            // then we we can exit here as nothing for us to do.
            return {
              session,
              user,
              isNewUser
            }
          } else {
            // Delete existing session if they are currently signed in as another user.
            // This will switch user accounts for the session in cases where the user was
            // already logged in with a different account.
            if (!useJwt) {
              await deleteSession(sessionToken)
            }

            // If signed in with a different acccount, effectively switching accounts
            user = userByEmail
          }
        } else {
          // If user not signed in, then we want to sign them in with this one
          user = userByEmail
        }
      } else {
        // Create user account if there isn't one for the email address already
        user = await createUser(profile)
        isNewUser = true
      }

      // Create new session
      session = useJwt ? await createJwtSession(user, sessionMaxAge) : await createSession(user)

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
          if (userByProviderAccountId.id === user.id) {
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
          session = useJwt ? await createJwtSession(userByProviderAccountId, sessionMaxAge) : await createSession(user)
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
        const userByEmail = await getUserByEmail(profile.email)
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
          // New accounts currently require an email address, so unless the user is
          // already logged in they must be signing in with an oAuth profile that
          // includes an email address (if they are already logged in, we don't care).
          //
          // This restriction may be lifted (or made optional) in future.
          if (!isSignedIn && !profile.email) { throw new InvalidProfile() }

          // If the current user is not logged in and the profile isn't linked to any user
          // accounts (by email or provider account id)...
          //
          // If no account matching the same [provider].id or .email exists, we can
          // create a new account for the user, link it to the oAuth acccount and
          // create a new session for them so they are signed in with it.
          user = await createUser(profile)
          await linkAccount(
            user.id,
            providerAccount.provider,
            providerAccount.type,
            providerAccount.id,
            providerAccount.refreshToken,
            providerAccount.accessToken,
            providerAccount.accessTokenExpires
          )

          session = useJwt ? await createJwtSession(user, sessionMaxAge) : await createSession(user)
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

const createJwtSession = async (user, sessionMaxAge) => {
  const expiryDate = new Date()
  expiryDate.setTime(expiryDate.getTime() + sessionMaxAge)
  const sessionExpires = expiryDate.toISOString()
  return Promise.resolve({
    user,
    sessionExpires,
    accessToken: randomBytes(32).toString('hex')
  })
}
