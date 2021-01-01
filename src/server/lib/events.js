/** Event triggered on successful sign in */
export async function signIn (message) {}

/** Event triggered on sign out */
export async function signOut (message) {}

/** Event triggered on user creation */
export async function createUser (message) {}

/** Event triggered when a user object is updated */
export async function updateUser (message) {}

/** Event triggered when an account is linked to a user */
export async function linkAccount (message) {}

/** Event triggered when a session is active */
export async function session (message) {}

/**
 * @TODO Event triggered when something goes wrong in an authentication flow
 * This event may be fired multiple times when an error occurs
 */
export async function error (message) {}
