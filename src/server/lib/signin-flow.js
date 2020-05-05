export default (adapter, sessionId, profile, providerAccount) => {
  return new Promise(async (resolve, reject) => {
    // Input validation
    if (!profile || !profile.email)
      return reject(new Error("Missing or invalid profile"))

    if (!providerAccount || !providerAccount.id || !providerAccount.type)
      return reject(new Error("Missing or invalid provider account"))

    // Get adapter - async as dependant on DB connection being ready
    const _adapter = await adapter.getAdapter()

    const {
      createUser,
      updateUser,
      getUserById,
      getUserByProviderAccountId,
      getUserByEmail,
      getUserByCredentials,
      removeUser,
      linkAccount,
      unlinkAccount,
      createSession,
      getSessionById,
      deleteSessionById,
    } = _adapter

    let session = sessionId ? await getSessionById(sessionId) : null
    let user = (session && session.user && session.user.id) ? await getUserById(session.user.id) : null
    let isNewAccount = false
    const isSignedIn = (session && session.id) ? true : false
    
    // @TODO replace all Error objects returned with custom error types

    // @TODO Support 'credentials' auth flow

    if (providerAccount.type === 'email') {
      // @TODO Ensure verification of email address before this portion of the flow can be triggered

      // If signing in with an email address, check if an account with the same
      // email address exists already.
      const userByEmail = await getUserByEmail(profile.email)
      if (userByEmail) {
        if (isSignedIn) {
          if (user.id == userByEmail.id) {
            // If they are already signed in with this account,
            // then we we can exit here as nothing for us to do.
            return resolve({
              session,
              user,
              isNewAccount
            })
          } else {
            // Delete existing session if they are currently signed in as another user.
            // This will switch user accounts for the session in cases where the user was
            // already logged in with a different account.
            await deleteSessionById(sessionId)

            // If signed in with a different acccount, effectively switching accounts.
            user = userByEmail
          }
        } else {
          // If user not signed in, then we want to sign them in with this one.
          user = userByEmail
        }
      } else {
        // Create user account if there isn't one for the email address already
        user = await createUser(profile)
        isNewAccount = true
      }

      // Create new session
      session = await createSession(user)

      return resolve({
        session,
        user,
        isNewAccount
      })
      
    } else if (providerAccount.type === 'oauth') {
      // If signing in with oauth account, check to see if the account exists already
      const userByProviderAccountId = await getUserByProviderAccountId(providerAccount.provider, providerAccount.id)
      if (userByProviderAccountId) {
        if (isSignedIn) {
          // If the user is already signed in with this account, we don't need to do anything.
          if (userByProviderAccountId.id === user.id) {
            return resolve({
              session,
              user,
              isNewAccount
            })
          } else {
            // If the user is currently signed in, but the new account they are signing in
            // with is already associated with another account, then we cannot link them
            // and need to return an error.
            return reject(new Error('This account is already associated with another user'))
          }
        } else {
          // If there is no active session, but the account being signed in with is already
          // associated with a valid user then create session to sign the user in.
          session = await createSession(userByProviderAccountId)
          return resolve({
            session,
            user: userByProviderAccountId,
            isNewAccount
          })
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

          // As they are already signed in, we don't need to do anything after linking them.
          return resolve({
            session,
            user,
            isNewAccount
          })
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
          return reject(new Error('Another user account associated with the same email address already exists'))
        } else {
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

          session = await createSession(user)
          isNewAccount = true
          return resolve({
            session,
            user,
            isNewAccount
          })
        }
      }
    } else {
      reject(new Error('Provider not supported'))
    }
  })
}