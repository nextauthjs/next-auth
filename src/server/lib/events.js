const signin = async (message) => {
  // Event triggered on successful sign in
 }

const signout = async (message) => { 
  // @TODO Event triggered on signout
}

const createUser = async (message) => {
  // @TODO Event triggered on user creation
}

const updateUser = async (message) => { 
  // @TODO Event triggered on update to user
}

const deleteUser = async (message) => {
  // @TODO Event triggered on user deletion
 }

const linkAccount = async (message) => {
  // @TODO Event triggered when an account is linked to a user
}

const unlinkAccount = async (message) => {
  // @TODO Event triggered when an account is unlinked from a user
}

const session = async (message) => {
  // @TODO Event triggered when an account is session is active
  // This event is triggered any time a session is active!
}

const error = async (message) => {
  // @TODO Event triggered when something goes wrong in an authentication flow
  // This event may be fired multiple times when an error occurs
}

export default {
  signin,
  signout,
  createUser,
  updateUser,
  deleteUser,
  linkAccount,
  unlinkAccount,
  session,
  error
}
