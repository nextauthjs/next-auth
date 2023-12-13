import { describe, expect, it, vi } from "vitest"
import { Auth, AuthConfig } from "../src/index.js"
import GitHub from "../src/providers/github.js"
import {
  AUTH_SECRET,
  SESSION_ACTION,
  SESSION_COOKIE_NAME,
} from "./constants.js"
import { decode, encode } from "../src/jwt.js"
import { parse } from "cookie"
import { defaultCallbacks } from "../src/lib/init.js"
import { Adapter } from "../src/adapters.js"
import { randomString } from "../src/lib/utils/web.js"
import { makeCookiesOptions } from "../lib/utils/cookie"

const authConfig: AuthConfig = {
  providers: [GitHub],
  trustHost: true,
  secret: AUTH_SECRET,
}

describe("makeCookiesOptions", () => {
  it("ensure secure defaults", () => {
    const cookies = makeCookiesOptions(true)

    expect(cookies.sessionToken.name).toBe("__Secure-authjs.session-token")
    expect(cookies.callbackUrl.name).toBe("__Secure-authjs.callback-url")
    expect(cookies.csrfToken.name).toBe("__Host-authjs.csrf-token")
    expect(cookies.pkceCodeVerifier.name).toBe(
      "__Secure-authjs.pkce.code_verifier"
    )
    expect(cookies.state.name).toBe("__Secure-authjs.state")
    expect(cookies.nonce.name).toBe("__Secure-authjs.nonce")

    for (const cookie of Object.values(cookies)) {
      expect(cookie.options.httpOnly).toBe(true)
      expect(cookie.options.secure).toBe(true)
      expect(cookie.options.sameSite).toBe("lax")
    }
  })
  it("merge options", () => {
    const cookies = makeCookiesOptions(true, {
      sessionToken: { options: { domain: ".myapp.com" } },
      callbackUrl: { name: "myapp.callback-url" },
    })

    expect(cookies.sessionToken.name).toBe("__Secure-authjs.session-token")
    expect(cookies.sessionToken.options.httpOnly).toBe(true)
    expect(cookies.sessionToken.options.secure).toBe(true)
    expect(cookies.sessionToken.options.sameSite).toBe("lax")
    expect(cookies.sessionToken.options.domain).toBe(".myapp.com")
    expect(cookies.callbackUrl.name).toBe("myapp.callback-url")
  })
})

describe("JWT session", () => {
  it("should return a valid JWT session response", async () => {
    const authEvents: AuthConfig["events"] = {
      session: vi.fn(),
    }
    vi.spyOn(authEvents, "session")
    authConfig.events = authEvents

    vi.spyOn(defaultCallbacks, "jwt")
    vi.spyOn(defaultCallbacks, "session")

    const now = Date.now()
    vi.setSystemTime(now)
    const expectedExpires = new Date(now + 30 * 24 * 60 * 60 * 1000) // 30 days

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
    const encoded = await encode({
      salt: SESSION_COOKIE_NAME,
      secret: AUTH_SECRET,
      token: expectedUser,
    })
    const expectedToken = {
      ...expectedUser,
      exp: expect.any(Number),
      iat: expect.any(Number),
      jti: expect.any(String),
    }
    const request = new Request(SESSION_ACTION, {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${encoded}`,
      },
    })
    const response = (await Auth(request, authConfig)) as Response
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
    expect(defaultCallbacks.jwt).toHaveBeenCalledWith({
      token: expectedToken,
      session: undefined
    })
    expect(defaultCallbacks.session).toHaveBeenCalledWith({
      session: expectedSession,
      token: expectedToken,
    })
  })
  it("should return null if no JWT session in the requests cookies", async () => {
    const request = new Request(SESSION_ACTION)
    const response = (await Auth(request, authConfig)) as Response
    const actual = await response.json()
    expect(actual).toEqual(null)
  })
  it("should return null if JWT session is invalid", async () => {
    const request = new Request(SESSION_ACTION, {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=invalid`,
      },
    })
    const response = (await Auth(request, authConfig)) as Response
    const actual = await response.json()
    expect(actual).toEqual(null)
  })
  it("should throw invalid JWT error if salt is invalid", async () => {
    const expectedSession = {
      name: "test",
      email: "test@test.com",
      picture: "https://test.com/test.png",
    }
    const invalidSalt = "__Secure-authjs.session-token-invalid"
    const encoded = await encode({
      salt: invalidSalt,
      secret: AUTH_SECRET,
      token: expectedSession,
    })
    const request = new Request(SESSION_ACTION, {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${encoded}`,
      },
    })
    // spy on logger
    const logger = {
      error: vi.fn(),
    }
    vi.spyOn(logger, "error").mockImplementation((e) =>
      console.log("JWT error: ", e)
    )
    authConfig.logger = logger
    const response = (await Auth(request, authConfig)) as Response
    const actual = await response.json()

    expect(logger.error).toHaveBeenCalledOnce()
    expect(actual).toEqual(null)
  })
  it("should update session expiry if ")
})

describe("Database session", () => {
  it("should return a valid database session in the response, and update the session in the database", async () => {
    const authEvents: AuthConfig["events"] = {
      session: vi.fn(),
    }
    vi.spyOn(authEvents, "session")
    authConfig.events = authEvents

    vi.spyOn(defaultCallbacks, "jwt")
    vi.spyOn(defaultCallbacks, "session")

    const now = Date.now()
    vi.setSystemTime(now)
    const updatedExpires = new Date(now + 30 * 24 * 60 * 60 * 1000) // 30 days
    const currentExpires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 1 day from now

    const expectedSessionToken = randomString(32)
    const expectedUser = {
      name: "test",
      email: "test@test.com",
      image: "https://test.com/test.png",
    }

    const mockAdapter: Adapter = {
      getSessionAndUser: vi.fn().mockResolvedValue({
        session: {
          sessionToken: expectedSessionToken,
          userId: randomString(32),
          expires: currentExpires,
        },
        user: expectedUser,
      }),
      deleteSession: vi.fn(),
      updateSession: vi.fn(),

      // not needed for this test but required for the assertion
      createUser: vi.fn(),
      getUser: vi.fn(),
      getUserByAccount: vi.fn(),
      getUserByEmail: vi.fn(),
      updateUser: vi.fn(),
      linkAccount: vi.fn(),
      createSession: vi.fn(),
    }
    authConfig.adapter = mockAdapter

    const request = new Request(SESSION_ACTION, {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${expectedSessionToken}`,
      },
    })

    const response = (await Auth(request, authConfig)) as Response
    const actual = await response.json()

    let cookies = response.headers
      .getSetCookie()
      .reduce<Record<string, string>>((acc, cookie) => {
        return { ...acc, ...parse(cookie) }
      }, {})
    const actualSessionToken = cookies[SESSION_COOKIE_NAME]

    expect(mockAdapter.getSessionAndUser).toHaveBeenCalledWith(
      expectedSessionToken
    )
    expect(mockAdapter.deleteSession).not.toHaveBeenCalled()
    expect(mockAdapter.updateSession).toHaveBeenCalledWith({
      sessionToken: expectedSessionToken,
      expires: updatedExpires,
    })
    expect(defaultCallbacks.session).toHaveBeenCalledWith({
      newSession: undefined,
      session: {
        user: expectedUser,
        expires: currentExpires.toISOString(),
      },
      user: expectedUser,
    })
    expect(authConfig.events?.session).toHaveBeenCalledWith({
      session: {
        user: expectedUser,
        expires: currentExpires.toISOString(),
      },
    })
    expect(defaultCallbacks.jwt).not.toHaveBeenCalled()

    expect(actualSessionToken).toEqual(expectedSessionToken)
    expect(actual.user).toEqual(expectedUser)
    expect(actual.expires).toEqual(currentExpires.toISOString())
  })
  it("should return a valid database session in the response, and not updating the session in the database", async () => {
    const authEvents: AuthConfig["events"] = {
      session: vi.fn(),
    }
    vi.spyOn(authEvents, "session")
    authConfig.events = authEvents

    vi.spyOn(defaultCallbacks, "jwt")
    vi.spyOn(defaultCallbacks, "session")

    const now = Date.now()
    vi.setSystemTime(now)
    const currentExpires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

    const expectedSessionToken = randomString(32)
    const expectedUser = {
      name: "test",
      email: "test@test.com",
      image: "https://test.com/test.png",
    }

    const mockAdapter: Adapter = {
      getSessionAndUser: vi.fn().mockResolvedValue({
        session: {
          sessionToken: expectedSessionToken,
          userId: randomString(32),
          expires: currentExpires,
        },
        user: expectedUser,
      }),
      deleteSession: vi.fn(),
      updateSession: vi.fn(),

      // not needed for this test but required for the assertion
      createUser: vi.fn(),
      getUser: vi.fn(),
      getUserByAccount: vi.fn(),
      getUserByEmail: vi.fn(),
      updateUser: vi.fn(),
      linkAccount: vi.fn(),
      createSession: vi.fn(),
    }
    authConfig.adapter = mockAdapter

    const request = new Request(SESSION_ACTION, {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${expectedSessionToken}`,
      },
    })

    const response = (await Auth(request, authConfig)) as Response
    const actual = await response.json()

    let cookies = response.headers
      .getSetCookie()
      .reduce<Record<string, string>>((acc, cookie) => {
        return { ...acc, ...parse(cookie) }
      }, {})
    const actualSessionToken = cookies[SESSION_COOKIE_NAME]

    expect(mockAdapter.getSessionAndUser).toHaveBeenCalledWith(
      expectedSessionToken
    )
    expect(mockAdapter.deleteSession).not.toHaveBeenCalled()
    expect(mockAdapter.updateSession).not.toHaveBeenCalled()
    expect(defaultCallbacks.session).toHaveBeenCalledWith({
      newSession: undefined,
      session: {
        user: expectedUser,
        expires: currentExpires.toISOString(),
      },
      user: expectedUser,
    })
    expect(authConfig.events?.session).toHaveBeenCalledWith({
      session: {
        user: expectedUser,
        expires: currentExpires.toISOString(),
      },
    })
    expect(defaultCallbacks.jwt).not.toHaveBeenCalled()

    expect(actualSessionToken).toEqual(expectedSessionToken)
    expect(actual.user).toEqual(expectedUser)
    expect(actual.expires).toEqual(currentExpires.toISOString())
  })
  it("should return null in the response, and delete the session", async () => {
    const authEvents: AuthConfig["events"] = {
      session: vi.fn(),
    }
    vi.spyOn(authEvents, "session")
    authConfig.events = authEvents

    vi.spyOn(defaultCallbacks, "jwt")
    vi.spyOn(defaultCallbacks, "session")

    const now = Date.now()
    vi.setSystemTime(now)
    const currentExpires = new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago

    const expectedSessionToken = randomString(32)
    const expectedUser = {
      name: "test",
      email: "test@test.com",
      image: "https://test.com/test.png",
    }

    const mockAdapter: Adapter = {
      getSessionAndUser: vi.fn().mockResolvedValue({
        session: {
          sessionToken: expectedSessionToken,
          userId: randomString(32),
          expires: currentExpires,
        },
        user: expectedUser,
      }),
      deleteSession: vi.fn(),
      updateSession: vi.fn(),

      // not needed for this test but required for the assertion
      createUser: vi.fn(),
      getUser: vi.fn(),
      getUserByAccount: vi.fn(),
      getUserByEmail: vi.fn(),
      updateUser: vi.fn(),
      linkAccount: vi.fn(),
      createSession: vi.fn(),
    }
    authConfig.adapter = mockAdapter

    const request = new Request(SESSION_ACTION, {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${expectedSessionToken}`,
      },
    })

    const response = (await Auth(request, authConfig)) as Response
    const actual = await response.json()

    let cookies = response.headers
      .getSetCookie()
      .reduce<Record<string, string>>((acc, cookie) => {
        return { ...acc, ...parse(cookie) }
      }, {})
    const actualSessionToken = cookies[SESSION_COOKIE_NAME]

    expect(mockAdapter.getSessionAndUser).toHaveBeenCalledWith(
      expectedSessionToken
    )
    expect(mockAdapter.deleteSession).toHaveBeenCalledWith(
      expectedSessionToken
    )
    expect(mockAdapter.updateSession).not.toHaveBeenCalled()
    expect(defaultCallbacks.session).not.toHaveBeenCalled()
    expect(authConfig.events?.session).not.toHaveBeenCalled()
    expect(defaultCallbacks.jwt).not.toHaveBeenCalled()

    expect(actualSessionToken).toEqual("")
    expect(actual).toEqual(null)
  })
})
