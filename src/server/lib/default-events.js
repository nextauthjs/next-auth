import { upperSnake } from "../../lib/errors"

/** @type {import("types").EventCallbacks} */
export const defaultEvents = {
  signIn() {},
  signOut() {},
  createUser() {},
  updateUser() {},
  linkAccount() {},
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
        logger.error(`${upperSnake(name)}_EVENT_ERROR`, e)
      }
    }
    return acc
  }, {})
}
