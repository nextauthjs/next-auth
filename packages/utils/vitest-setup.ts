import { afterEach, beforeAll, beforeEach, vi } from "vitest"

globalThis.crypto ??= require("node:crypto").webcrypto

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})
