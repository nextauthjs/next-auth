import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import * as cookie from "../../src/lib/vendored/cookie.js"
import { MemoryAdapter, initMemory } from "../memory-adapter.js"
import { randomString } from "../../src/lib/utils/web.js"
import type { AdapterUser } from "../../src/adapters.js"
import { decode, encode } from "../../src/jwt.js"
import {
  callbacks,
  getExpires,
  events,
  logger,
  makeAuthRequest,
  testConfig,
  AUTH_SECRET,
  SESSION_COOKIE_NAME,
  assertNoCacheResponseHeaders,
} from "../utils.js"

const { parse: parseCookie } = cookie

describe("assert GET session action", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  describe("JWT strategy", () => {
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

      let cookies = response.headers.getSetCookie().reduce((acc, cookie) => {
        return { ...acc, ...parseCookie(cookie) }
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

      assertNoCacheResponseHeaders(response)
    })

    it("should return null if no JWT session in the requests cookies", async () => {
      const { response } = await makeAuthRequest({
        action: "session",
      })
      const actual = await response.json()
      expect(actual).toEqual(null)

      assertNoCacheResponseHeaders(response)
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

      assertNoCacheResponseHeaders(response)
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

      expect(actual).toEqual(null)
      expect(logger.error).toHaveBeenCalledOnce()

      assertNoCacheResponseHeaders(response)
    })
  })
  describe("Database strategy", () => {
    it("should return a valid database session in the response, and update the session in the database", async () => {
      vi.spyOn(callbacks, "jwt")
      vi.spyOn(callbacks, "session")
      const updatedExpires = getExpires()
      const currentExpires = getExpires(24 * 60 * 60 * 1000) // 1 day from now

      const expectedSessionToken = randomString(32)
      const expectedUserId = randomString(32)
      const expectedUser = {
        id: expectedUserId,
        name: "test",
        email: "test@test.com",
        image: "https://test.com/test.png",
        emailVerified: null,
      } satisfies AdapterUser

      // const expectedUserId = randomString(32)
      const memory = initMemory()
      memory.users.set(expectedUserId, expectedUser)
      memory.sessions.set(expectedSessionToken, {
        sessionToken: expectedSessionToken,
        userId: expectedUserId,
        expires: currentExpires,
      })

      const adapter = MemoryAdapter(memory)

      const { response } = await makeAuthRequest({
        action: "session",
        cookies: {
          [SESSION_COOKIE_NAME]: expectedSessionToken,
        },
        config: {
          adapter,
        },
      })

      const actualBodySession = await response.json()

      let cookies = response.headers.getSetCookie().reduce((acc, cookie) => {
        return { ...acc, ...parseCookie(cookie) }
      }, {})
      const actualSessionToken = cookies[SESSION_COOKIE_NAME]

      expect(memory.users.get(expectedUserId)).toEqual(expectedUser)
      expect(memory.sessions.get(expectedSessionToken)).toEqual({
        sessionToken: expectedSessionToken,
        userId: expectedUserId,
        expires: updatedExpires,
      })

      expect(callbacks.session).toHaveBeenCalledWith({
        newSession: undefined,
        session: {
          user: expectedUser,
          expires: currentExpires,
          sessionToken: expectedSessionToken,
          userId: expectedUserId,
        },
        user: expectedUser,
      })
      expect(callbacks.jwt).not.toHaveBeenCalled()

      expect(actualSessionToken).toEqual(expectedSessionToken)
      expect(actualBodySession.user).toEqual({
        image: expectedUser.image,
        name: expectedUser.name,
        email: expectedUser.email,
      })
      expect(actualBodySession.expires).toEqual(currentExpires.toISOString())

      assertNoCacheResponseHeaders(response)
    })

    it("should return null in the response, and delete the session", async () => {
      vi.spyOn(callbacks, "jwt")
      vi.spyOn(callbacks, "session")
      const currentExpires = getExpires(-24 * 60 * 60 * 1000) // 1 day before

      const expectedSessionToken = randomString(32)
      const expectedUserId = randomString(32)
      const expectedUser = {
        id: expectedUserId,
        name: "test",
        email: "test@test.com",
        image: "https://test.com/test.png",
        emailVerified: null,
      } satisfies AdapterUser

      const memory = initMemory()
      memory.users.set(expectedUserId, expectedUser)
      memory.sessions.set(expectedSessionToken, {
        sessionToken: expectedSessionToken,
        userId: expectedUserId,
        expires: currentExpires,
      })

      const adapter = MemoryAdapter(memory)

      const { response } = await makeAuthRequest({
        action: "session",
        cookies: {
          [SESSION_COOKIE_NAME]: expectedSessionToken,
        },
        config: {
          adapter,
        },
      })

      const actualBodySession = await response.json()

      let cookies = response.headers.getSetCookie().reduce((acc, cookie) => {
        return { ...acc, ...parseCookie(cookie) }
      }, {})
      const actualSessionToken = cookies[SESSION_COOKIE_NAME]

      expect(memory.users.get(expectedUserId)).toEqual(expectedUser)
      expect(memory.sessions.get(expectedSessionToken)).toEqual(undefined)
      expect(callbacks.session).not.toHaveBeenCalled()
      expect(events.session).not.toHaveBeenCalled()
      expect(callbacks.jwt).not.toHaveBeenCalled()

      expect(actualSessionToken).toEqual("")
      expect(actualBodySession).toEqual(null)

      assertNoCacheResponseHeaders(response)
    })
  })

  describe("Dynamic session maxAge", () => {
    it("should create a session cookie when maxAge is 'session'", async () => {
      const authConfig = testConfig({
        session: {
          maxAge: "session" as const,
        },
      })

      const expectedUser = {
        name: "test",
        email: "test@test.com",
        picture: "https://test.com/test.png",
      }

      const expectedToken = {
        ...expectedUser,
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.any(String),
        sub: expect.any(String),
      }

      const salt = SESSION_COOKIE_NAME
      const encodedToken = await encode({
        salt,
        secret: AUTH_SECRET,
        token: expectedToken,
      })

      const { response } = await makeAuthRequest({
        action: "session",
        cookies: { [SESSION_COOKIE_NAME]: encodedToken },
        config: authConfig,
      })

      const cookies = response.headers.getSetCookie()
      const sessionCookie = cookies.find((c) =>
        c.includes(SESSION_COOKIE_NAME)
      )

      // Session cookie should not have Max-Age or Expires
      expect(sessionCookie).toBeDefined()
      expect(sessionCookie).not.toContain("Max-Age")
      expect(sessionCookie).not.toContain("Expires")
    })

    it("should handle dynamic maxAge based on token data", async () => {
      const dynamicMaxAge = vi.fn(async ({ token }) => {
        return token?.rememberMe ? 30 * 24 * 60 * 60 : "session"
      })

      const authConfig = testConfig({
        session: {
          maxAge: dynamicMaxAge,
        },
      })

      const expectedUser = {
        name: "test",
        email: "test@test.com",
        picture: "https://test.com/test.png",
      }

      const expectedToken = {
        ...expectedUser,
        rememberMe: false,
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.any(String),
        sub: expect.any(String),
      }

      const salt = SESSION_COOKIE_NAME
      const encodedToken = await encode({
        salt,
        secret: AUTH_SECRET,
        token: expectedToken,
      })

      const { response } = await makeAuthRequest({
        action: "session",
        cookies: { [SESSION_COOKIE_NAME]: encodedToken },
        config: authConfig,
      })

      const cookies = response.headers.getSetCookie()
      const sessionCookie = cookies.find((c) =>
        c.includes(SESSION_COOKIE_NAME)
      )

      // Should create session cookie when rememberMe is false
      expect(dynamicMaxAge).toHaveBeenCalledWith({
        token: expect.objectContaining({ rememberMe: false }),
        trigger: undefined,
        session: undefined,
      })
      expect(sessionCookie).toBeDefined()
      expect(sessionCookie).not.toContain("Max-Age")
      expect(sessionCookie).not.toContain("Expires")
    })

    it("should handle dynamic maxAge with persistent cookie", async () => {
      const dynamicMaxAge = vi.fn(async ({ token }) => {
        return token?.rememberMe ? 30 * 24 * 60 * 60 : "session"
      })

      const authConfig = testConfig({
        session: {
          maxAge: dynamicMaxAge,
        },
      })

      const expectedToken = {
        name: "test",
        email: "test@test.com",
        picture: "https://test.com/test.png",
        rememberMe: true,
        exp: expect.any(Number),
        iat: expect.any(Number),
        jti: expect.any(String),
        sub: expect.any(String),
      }

      const salt = SESSION_COOKIE_NAME
      const encodedToken = await encode({
        salt,
        secret: AUTH_SECRET,
        token: expectedToken,
      })

      const { response } = await makeAuthRequest({
        action: "session",
        cookies: { [SESSION_COOKIE_NAME]: encodedToken },
        config: authConfig,
      })

      const cookies = response.headers.getSetCookie()
      const sessionCookie = cookies.find((c) =>
        c.includes(SESSION_COOKIE_NAME)
      )

      // Should create persistent cookie when rememberMe is true
      expect(dynamicMaxAge).toHaveBeenCalledWith({
        token: expect.objectContaining({ rememberMe: true }),
        trigger: undefined,
        session: undefined,
      })
      expect(sessionCookie).toBeDefined()
      expect(sessionCookie).toContain("Max-Age=2592000") // 30 days
    })
  })
})
