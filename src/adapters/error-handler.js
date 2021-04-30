import { UnknownError } from "../lib/errors"

/**
 * Handles adapter induced errors.
 * @param {import("types/adapters").AdapterInstance} adapter
 * @return {import("types/adapters").AdapterInstance}
 */
export default function adapterErrorHandler(adapter) {
  return Object.keys(adapter).reduce((acc, method) => {
    acc[method] = async (...args) => {
      try {
        return await acc[method](...args)
      } catch (error) {
        const e = new UnknownError(error)
        e.name = `${method[0].toUpperCase()}${method.slice(1)}Error`
        throw e
      }
    }
    return acc
  }, {})
}
