import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import {
  makeAuthRequest,
  testConfig,
  assertNoCacheResponseHeaders,
} from "../utils.js"

describe("assert GET CSRF action", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it("shoud return CSRF token with no cache headers", async () => {
    const authConfig = testConfig()
    const { response } = await makeAuthRequest({
      action: "csrf",
      config: authConfig,
    })
    assertNoCacheResponseHeaders(response)
    const body = await response.json()

    expect(body.csrfToken).toBeDefined()
  })
})
