import SimpleWebAuthnServer from "@simplewebauthn/server"
import { saveRegistrationInfo } from './helpers'

import type { Authenticator } from '../../types'

/*
 * @desc GET - /api/auth/webauthn/register
 * @type object
 **/
const generateRegistration = () => {
  // Human-readable title for your website
  const rpName = "SimpleWebAuthn Example"
  // A unique identifier for your website
  const rpID = "localhost"
  // The URL at which registrations and authentications should occur
  const origin = `https://${rpID}`

  // (Pseudocode) Retrieve the user from the database
  // after they've logged in
  const user: UserModel = getUserFromDB(loggedInUserId)
  // (Pseudocode) Retrieve any of the user's previously-
  // registered authenticators
  const userAuthenticators: Authenticator[] = getUserAuthenticators(user)

  const options = generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: user.username,
    // Don't prompt users for additional information about the authenticator
    // (Recommended for smoother UX)
    attestationType: "none",
    // Prevent users from re-registering existing authenticators
    excludeCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: "public-key",
      // Optional
      transports: authenticator.transports,
    })),
  })

  // (Pseudocode) Remember the challenge for this user
  setUserCurrentChallenge(user, options.challenge)

  return options
}

/*
 * @desc POST /api/auth/webauthn/register
 * @type object
 **/
const verifyRegistration = (req) => {
  const { body } = req

  // (Pseudocode) Retrieve the logged-in user
  const user: UserModel = getUserFromDB(loggedInUserId)
  // (Pseudocode) Get `options.challenge` that was saved above
  const expectedChallenge: string = getUserCurrentChallenge(user)

  let verification
  try {
    verification = await verifyRegistrationResponse({
      credential: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
    })
  } catch (error) {
    console.error(error)
    return res.status(400).send({ error: error.message })
  }

  const { verified } = verification
  if (verified) {
    saveRegistrationInfo({ verification, registrationInfo })
  }
  return { verified }
}
