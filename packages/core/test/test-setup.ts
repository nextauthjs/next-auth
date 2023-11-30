import { afterAll, afterEach, beforeAll } from "vitest"

beforeAll(() => {
  globalThis.crypto ??= require("node:crypto").webcrypto
})

afterAll(() => {
})

afterEach(() => {
})
