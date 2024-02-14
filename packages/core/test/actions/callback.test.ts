import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import * as jose from "jose"
import * as o from "oauth4webapi"

import GitHub from "../../src/providers/github.js"

import { makeAuthRequest } from "../utils.js"

describe("assert GET callback action", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it("should throw InvalidProvider error if the provider ID is not found", async () => {
    const { response } = await makeAuthRequest({
      action: "callback",
      path: "/invalid-provider",
    })

    expect(response.status).toEqual(302)
    expect(response.headers.get("location")).toEqual(
      `https://authjs.test/auth/error?error=InvalidProvider`
    )
  })

  it("should throws InvalidCheck is missing query state and isOnRedirectProxy is true", async () => {
    const { response } = await makeAuthRequest({
      action: "callback",
      path: "/github",
      query: { state: "random" },
      config: {
        redirectProxyUrl: "https://login.example.com",
        providers: [GitHub],
      },
    })

    expect(response.status).toEqual(302)
    expect(response.headers.get("location")).toEqual(
      `https://authjs.test/auth/error?error=InvalidCheck`
    )
  })

  it("should redirect query with state if redirectProxyUrl is defined, and state query contains origin", async () => {
    const encodedState = jose.base64url.encode(
      JSON.stringify({
        random: o.generateRandomState(),
        origin: "https://login.example.com",
      })
    )
    const { response } = await makeAuthRequest({
      action: "callback",
      path: "/github",
      query: { state: encodedState },
      host: "login.example.com",
      config: {
        redirectProxyUrl: "https://login.example.com",
        providers: [GitHub],
      },
    })

    expect(response.status).toEqual(302)
    expect(response.headers.get("location")).toEqual(
      `https://login.example.com?state=${encodedState}`
    )
  })
})
