export const saveRegistrationInfo = ({ verification, registrationInfo }) => {
  const { registrationInfo } = verification
  const { credentialPublicKey, credentialID, counter } = registrationInfo

  const newAuthenticator: Authenticator = {
    credentialID,
    credentialPublicKey,
    counter,
  }

  // (Pseudocode) Save the authenticator info so that we can
  // get it by user ID later
  saveNewUserAuthenticatorInDB(user, newAuthenticator)
}

// TODO: 
// (Pseudocode) Fetch User from adapter
export const getUserFromDb = (userId) => {
  return db.query('Users').where({ userId })
}

export const updateRegistrationCounter = ({ verification, authenticationInfo }) = {
  const { authenticationInfo } = verification;
  const { newCounter } = authenticationInfo;

  saveUpdatedAuthenticatorCounter(authenticator, newCounter);
}
