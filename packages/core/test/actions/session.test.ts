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
    it("should return a valid JWT session response without re-signing a fresh token", async () => {
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

      const cookies = response.headers
        .getSetCookie()
        .reduce(
          (acc, cookie) => ({ ...acc, ...parseCookie(cookie) }),
          {} as Record<string, string>
        )

      const expectedSession = {
        user: expectedUserInBody,
        expires: expectedExpires.toISOString(),
      }

      // A fresh token is not yet due for re-signing, so no new session cookie is set
      expect(cookies[SESSION_COOKIE_NAME]).toBeUndefined()
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

    it("should not re-sign the JWT token when within the updateAge window", async () => {
      vi.useRealTimers()
      vi.useFakeTimers()
      const now = Date.now()
      vi.setSystemTime(now)

      const updateAge = 60 * 60 // 1 hour

      const token = {
        name: "test",
        email: "test@test.com",
        picture: "https://test.com/test.png",
      }
      const originalToken = await encode({
        salt: SESSION_COOKIE_NAME,
        secret: AUTH_SECRET,
        token,
      })

      const { response } = await makeAuthRequest({
        action: "session",
        cookies: { [SESSION_COOKIE_NAME]: originalToken },
        config: { session: { updateAge } },
      })

      const body = await response.json()
      expect(body).not.toBeNull()

      const cookies = response.headers
        .getSetCookie()
        .reduce(
          (acc, cookie) => ({ ...acc, ...parseCookie(cookie) }),
          {} as Record<string, string>
        )
      // Token was created at `now`, updateAge is 1 hour — should not re-sign yet
      expect(cookies[SESSION_COOKIE_NAME]).toBeUndefined()

      vi.useRealTimers()
    })

    it("should re-sign the JWT token after updateAge has elapsed", async () => {
      vi.useRealTimers()
      vi.useFakeTimers()
      const now = Date.now()
      vi.setSystemTime(now)

      const updateAge = 60 * 60 // 1 hour

      const token = {
        name: "test",
        email: "test@test.com",
        picture: "https://test.com/test.png",
      }
      const originalToken = await encode({
        salt: SESSION_COOKIE_NAME,
        secret: AUTH_SECRET,
        token,
      })

      // Advance time past updateAge
      vi.setSystemTime(now + (updateAge + 1) * 1000)

      const { response } = await makeAuthRequest({
        action: "session",
        cookies: { [SESSION_COOKIE_NAME]: originalToken },
        config: { session: { updateAge } },
      })

      const body = await response.json()
      expect(body).not.toBeNull()

      const cookies = response.headers
        .getSetCookie()
        .reduce(
          (acc, cookie) => ({ ...acc, ...parseCookie(cookie) }),
          {} as Record<string, string>
        )
      // updateAge has elapsed — a new signed token should be in the Set-Cookie header
      expect(cookies[SESSION_COOKIE_NAME]).toBeDefined()
      expect(cookies[SESSION_COOKIE_NAME]).not.toEqual(originalToken)

      vi.useRealTimers()
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
})
