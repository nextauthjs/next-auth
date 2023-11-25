import { afterAll, afterEach, beforeAll } from "vitest"
// import { setupServer } from "msw/node"
// import { handlers } from "./test/handlers"

// const server = setupServer()

// Start server before all tests
beforeAll(() => {
  globalThis.crypto ??= require("node:crypto").webcrypto
  // return server.listen({ onUnhandledRequest: "error" })
})

//  Close server after all tests
afterAll(() => {
  // return server.close()
})

// Reset handlers after each test `important for test isolation`
afterEach(() => {
  // return server.resetHandlers()
})
