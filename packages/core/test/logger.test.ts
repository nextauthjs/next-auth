import { describe, it, expect, vi } from "vitest"
import { setLogger } from "../src/lib/utils/logger"
import type { AuthConfig } from "../src/types.ts"

describe("setLogger", () => {
  it("should return default logger if no custom logger is provided", () => {
    const logger = setLogger({})
    expect(logger.error).toBeInstanceOf(Function)
    expect(logger.debug).toBeInstanceOf(Function)
    expect(logger.warn).toBeInstanceOf(Function)
  })

  it("should override error and warn with custom logger", () => {
    const customError = vi.fn()
    const customWarn = vi.fn()
    const logger = setLogger({
      logger: {
        error: customError,
        warn: customWarn,
      },
    })
    expect(logger.error).toBe(customError)
    expect(logger.warn).toBe(customWarn)
    expect(logger.debug).toBeInstanceOf(Function)
  })

  it("should override debug only if debug is true", () => {
    const customDebug = vi.fn()
    const logger1 = setLogger({
      logger: {
        debug: customDebug,
      },
      debug: true,
    })
    expect(logger1.debug).toBe(customDebug)
    expect(logger1.error).toBeInstanceOf(Function)
    expect(logger1.warn).toBeInstanceOf(Function)

    const logger2 = setLogger({
      logger: {
        debug: customDebug,
      },
      debug: false,
    })
    expect(logger2.debug).not.toBe(customDebug)
    expect(logger2.debug).toBeInstanceOf(Function)
    expect(logger2.error).toBeInstanceOf(Function)
    expect(logger2.warn).toBeInstanceOf(Function)
  })

  it("should assign the new logger to config.logger if not present", () => {
    const config: Partial<AuthConfig> = {}
    const logger = setLogger(config)
    expect(config.logger).toBe(logger)
  })
})
