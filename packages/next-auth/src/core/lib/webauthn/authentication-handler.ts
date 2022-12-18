import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';
import { getUserFromDb } from "./helpers"

import type { } from '@simplewebauthn/typescript-types'

/*
 * @desc GET /api/auth/webauthn/authenticate
 * @type object
 **/
const generateAuthOptions = (userId) => {
  // (Pseudocode) Retrieve the logged-in user
  const user: UserModel = getUserFromDb(userId)
  // (Pseudocode) Retrieve any of the user's previously-
  // registered authenticators
  const userAuthenticators: Authenticator[] = getUserAuthenticators(user)

  const options = generateAuthenticationOptions({
    // Require users to use a previously-registered authenticator
    allowCredentials: userAuthenticators.map((authenticator) => ({
      id: authenticator.credentialID,
      type: "public-key",
      // Optional
      transports: authenticator.transports,
    })),
    userVerification: "preferred",
  })

  // (Pseudocode) Remember this challenge for this user
  setUserCurrentChallenge(user, options.challenge)

  return options
}

/*
 * @desc POST to /api/auth/webauthn/authenticate
 * @type object
 * @param body: AuthenticationCredentialJSON
 **/
const verifyAuthResponse = (req) => {
  const { body } = req;

  // (Pseudocode) Retrieve the logged-in user
  const user: UserModel = getUserFromDB(loggedInUserId);
  // (Pseudocode) Get `options.challenge` that was saved above
  const expectedChallenge: string = getUserCurrentChallenge(user);
  // (Pseudocode} Retrieve an authenticator from the DB that
  // should match the `id` in the returned credential
  const authenticator = getUserAuthenticator(user, body.id);

  if (!authenticator) {
    throw new Error(`Could not find authenticator ${body.id} for user ${user.id}`);
  }

  let verification;
  try {
    verification = await verifyAuthenticationResponse({
      credential: body,
      expectedChallenge,
      expectedOrigin: origin,
      expectedRPID: rpID,
      authenticator,
    });
  } catch (error) {
    console.error(error);
    return res.status(400).send({ error: error.message });
  }

  const { verified } = verification;
  return verified
}
