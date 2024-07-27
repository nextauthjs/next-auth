import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import * as jose from "jose"
import * as o from "oauth4webapi"

import GitHub from "../../src/providers/github.js"
import Credentials from "../../src/providers/credentials.js"

import { makeAuthRequest } from "../utils.js"
import { skipCSRFCheck } from "../../src/index.js"

describe("assert GET callback action", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it("should throw Configuration error if the provider ID is not found", async () => {
    const { response } = await makeAuthRequest({
      action: "callback",
      path: "/invalid-provider",
    })

    expect(response.status).toEqual(302)
    expect(response.headers.get("location")).toEqual(
      `https://authjs.test/auth/error?error=Configuration`
    )
  })

  it("should throw Configuration error is missing query state and isOnRedirectProxy is true", async () => {
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
      `https://authjs.test/auth/error?error=Configuration`
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

it("should redirect to the custom error page is custom error page is defined", async () => {
  const { response } = await makeAuthRequest({
    action: "callback",
    path: "/credentials",
    config: {
      pages: {
        error: "/custom/error",
      },
      providers: [Credentials],
    },
  })

  expect(response.status).toEqual(302)
  expect(response.headers.get("location")).toEqual(
    `https://authjs.test/custom/error?error=Configuration`
  )
})

it("should stay on signin page if the provider is credentials and authorize returns null", async () => {
  const { response } = await makeAuthRequest({
    action: "callback",
    path: "/credentials",
    body: {
      username: "foo",
      password: "bar",
    },
    config: {
      skipCSRFCheck,
      providers: [
        Credentials({
          authorize() {
            return null
          },
        }),
      ],
    },
  })

  expect(response.status).toEqual(302)
  expect(response.headers.get("location")).toEqual(
    `https://authjs.test/auth/signin?error=CredentialsSignin&code=credentials`
  )
})
