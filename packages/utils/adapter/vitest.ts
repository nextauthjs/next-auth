import { test, expect, beforeAll, afterAll } from "vitest"

// @ts-expect-error
globalThis.test = test
// @ts-expect-error
globalThis.expect = expect
// @ts-expect-error
globalThis.beforeAll = beforeAll
// @ts-expect-error
globalThis.afterAll = afterAll

export * from "./index"
