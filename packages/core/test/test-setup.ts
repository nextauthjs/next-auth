import { afterAll, afterEach, beforeAll, beforeEach, vi } from "vitest"

beforeAll(() => {
  globalThis.crypto ??= require("node:crypto").webcrypto
})

afterAll(() => {})

beforeEach(() => {
  vi.useFakeTimers()
  globalThis.crypto.randomUUID = () => "c3734bb6-2487-427f-af2d-baa1c8e0f7a3" // mock randomUUID
})

afterEach(() => {
  vi.useRealTimers()
})
