import { capitalize, UnknownError, upperSnake } from "../lib/errors"

/**
 * Handles adapter induced errors.
 * @param {import("types/adapters").AdapterInstance} adapter
 * @param {import("types").LoggerInstance} logger
 * @return {import("types/adapters").AdapterInstance}
 */
export default function adapterErrorHandler(adapter, logger) {
  return Object.keys(adapter).reduce((acc, method) => {
    const name = capitalize(method)
    const code = `${adapter.displayName ?? "ADAPTER"}_${upperSnake(name)}`

    const adapterMethod = adapter[method]
    acc[method] = async (...args) => {
      try {
        logger.debug(code, ...args)
        return await adapterMethod(...args)
      } catch (error) {
        logger.error(`${code}_ERROR`, error)
        const e = new UnknownError(error)
        e.name = `${name}Error`
        throw e
      }
    }
    return acc
  }, {})
}
