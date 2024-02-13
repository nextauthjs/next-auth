import { beforeEach, describe, expect, it, vi } from "vitest"

import { AUTH_SECRET, SESSION_COOKIE_NAME } from "../constants.js"
import { decode, encode } from "../../src/jwt.js"
import { parse } from "cookie"
import {
  callbacks,
  getExpires,
  logger,
  makeAuthRequest,
  testConfig,
} from "../utils.js"

describe("GET", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("should return a valid JWT session response", async () => {
    const authConfig = testConfig()

    const expectedExpires = getExpires()

    vi.spyOn(callbacks, "jwt")
    vi.spyOn(callbacks, "session")

    const expectedUser = {
      name: "test",
      email: "test@test.com",
      picture: "https://test.com/test.png",
    }
    const expectedUserInBody = {
      name: "test",
      email: "test@test.com",
      image: "https://test.com/test.png",
    }
    const expectedToken = {
      ...expectedUser,
      exp: expect.any(Number),
      iat: expect.any(Number),
      jti: expect.any(String),
    }
    const { response } = await makeAuthRequest({
      action: "session",
      cookies: {
        [SESSION_COOKIE_NAME]: await encode({
          salt: SESSION_COOKIE_NAME,
          secret: AUTH_SECRET,
          token: expectedUser,
        }),
      },
      config: authConfig,
    })
    const actualBodySession = await response.json()

    let cookies = response.headers
      .getSetCookie()
      .reduce<Record<string, string>>((acc, cookie) => {
        return { ...acc, ...parse(cookie) }
      }, {})
    const sessionToken = cookies[SESSION_COOKIE_NAME]
    const actualToken = await decode({
      salt: SESSION_COOKIE_NAME,
      secret: AUTH_SECRET,
      token: sessionToken,
    })

    const { exp, iat, jti, ...actualUser } = actualToken || {}

    const expectedSession = {
      user: expectedUserInBody,
      expires: expectedExpires.toISOString(),
    }

    expect(actualUser).toEqual(expectedUser)
    expect(actualBodySession).toEqual(expectedSession)
    expect(authConfig.events?.session).toHaveBeenCalledWith({
      session: expectedSession,
      token: expectedToken,
    })
    expect(callbacks.jwt).toHaveBeenCalledWith({
      token: expectedToken,
      session: undefined,
    })
    expect(callbacks.session).toHaveBeenCalledWith({
      session: expectedSession,
      token: expectedToken,
    })
  })

  it("should return null if no JWT session in the requests cookies", async () => {
    const { response } = await makeAuthRequest({
      action: "session",
    })
    const actual = await response.json()
    expect(actual).toEqual(null)
  })

  it("should return null if JWT session is invalid", async () => {
    const { response } = await makeAuthRequest({
      action: "session",
      cookies: {
        [SESSION_COOKIE_NAME]: "invalid",
      },
    })
    const actual = await response.json()
    expect(actual).toEqual(null)
  })

  it("should throw invalid JWT error if salt is invalid", async () => {
    const { response } = await makeAuthRequest({
      action: "session",
      cookies: {
        [SESSION_COOKIE_NAME]: await encode({
          salt: "__Secure-authjs.session-token-invalid",
          secret: AUTH_SECRET,
          token: {
            name: "test",
            email: "test@test.com",
            picture: "https://test.com/test.png",
          },
        }),
      },
    })
    const actual = await response.json()

    expect(logger.error).toHaveBeenCalledOnce()
    expect(actual).toEqual(null)
  })
})

// describe("POST - JWT session", () => {})
