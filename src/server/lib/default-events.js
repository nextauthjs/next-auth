export const defaultEvents = {
  /** Event triggered on successful sign in */
  signIn() {},
  /** Event triggered on sign out */
  signOut() {},
  /** Event triggered on user creation */
  createUser() {},
  /** Event triggered when a user object is updated */
  updateUser() {},
  /** Event triggered when an account is linked to a user */
  linkAccount() {},
  /** Event triggered when a session is active */
  session() {},
}

/**
 * Wraps an object of methods and adds error handling.
 * @param {import("types").EventCallbacks} methods
 * @param {import("types").LoggerInstance} logger
 * @return {import("types").EventCallbacks}
 */
export function withErrorHandling(methods, logger) {
  return Object.entries(methods).reduce((acc, [name, method]) => {
    acc[name] = async (...args) => {
      try {
        return await method(...args)
      } catch (e) {
        logger.error("EVENT_ERROR", e)
      }
    }
    return acc
  }, {})
}
