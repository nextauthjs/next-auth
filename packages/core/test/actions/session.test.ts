import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { parse } from "cookie"
import { MemoryAdapter, initMemory } from "../memory-adapter.js"
import { randomString } from "../../src/lib/utils/web.js"
import { AdapterUser } from "../../adapters.js"
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
} from "../utils.js"

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

      let cookies = response.headers
        .getSetCookie()
        .reduce<Record<string, string>>((acc, cookie) => {
          return { ...acc, ...parse(cookie) }
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

      let cookies = response.headers
        .getSetCookie()
        .reduce<Record<string, string>>((acc, cookie) => {
          return { ...acc, ...parse(cookie) }
        }, {})
      const actualSessionToken = cookies[SESSION_COOKIE_NAME]

      expect(memory.users.get(expectedUserId)).toEqual(expectedUser)
      expect(memory.sessions.get(expectedSessionToken)).toEqual(undefined)
      expect(callbacks.session).not.toHaveBeenCalled()
      expect(events.session).not.toHaveBeenCalled()
      expect(callbacks.jwt).not.toHaveBeenCalled()

      expect(actualSessionToken).toEqual("")
      expect(actualBodySession).toEqual(null)
    })
  })
})
