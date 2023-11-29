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
import { Adapter, AdapterSession } from "../src/adapters.js"
import { randomString } from "../src/lib/utils/web.js"

const authConfig: AuthConfig = {
  providers: [GitHub],
  trustHost: true,
  secret: AUTH_SECRET,
}

describe("JWT session", () => {
  it("should return a valid JWT session response", async () => {
    const authEvents: AuthConfig["events"] = {
      session: () => {},
    }
    vi.spyOn(authEvents, "session")
    authConfig.events = authEvents

    vi.spyOn(defaultCallbacks, "jwt")
    vi.spyOn(defaultCallbacks, "session")

    const expectedSession = {
      name: "test",
      email: "test@test.com",
      picture: "https://test.com/test.png",
    }
    const expectedSessionInBody = {
      name: "test",
      email: "test@test.com",
      image: "https://test.com/test.png",
    }
    const encoded = await encode({
      salt: SESSION_COOKIE_NAME,
      secret: AUTH_SECRET,
      token: expectedSession,
    })
    const request = new Request(SESSION_ACTION, {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${encoded}`,
      },
    })
    const response = (await Auth(request, authConfig)) as Response
    const bodySession = await response.json()

    let cookies = response.headers
      .getSetCookie()
      .reduce<Record<string, string>>((acc, cookie) => {
        return { ...acc, ...parse(cookie) }
      }, {})
    const sessionToken = cookies[SESSION_COOKIE_NAME]
    const decoded = await decode<{
      // TODO: This shouldn't be necessary?
      exp: number
      iat: number
      jti: string
    }>({
      salt: SESSION_COOKIE_NAME,
      secret: AUTH_SECRET,
      token: sessionToken,
    })

    const { exp, iat, jti, ...actualSession } = decoded || {}

    expect(actualSession).toEqual(expectedSession)
    expect(bodySession.user).toEqual(expectedSessionInBody)
    expect(bodySession.expires).toBeDefined()
    expect(authConfig.events?.session).toHaveBeenCalledOnce()
    expect(defaultCallbacks.jwt).toHaveBeenCalledOnce()
    expect(defaultCallbacks.session).toHaveBeenCalledOnce()
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
})

describe("Database session", () => {
  it("should return a valid database session response", async () => {
    const authEvents: AuthConfig["events"] = {
      session: () => {},
    }
    vi.spyOn(authEvents, "session")
    authConfig.events = authEvents

    vi.spyOn(defaultCallbacks, "jwt")
    vi.spyOn(defaultCallbacks, "session")

    const expectedSessionUser = {
      name: "test",
      email: "test@test.com",
      image: "https://test.com/test.png",
    }
    const expectedSessionUserInBody = {
      name: "test",
      email: "test@test.com",
      image: "https://test.com/test.png",
    }
    // 1 day from now
    const currentExpires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const expectedToken = randomString(32)
    const expectedSession: AdapterSession = {
      sessionToken: expectedToken,
      userId: "userId",
      expires: currentExpires,
    }

    const encoded = await encode({
      salt: SESSION_COOKIE_NAME,
      secret: AUTH_SECRET,
      token: expectedSession,
    })
    const request = new Request(SESSION_ACTION, {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${encoded}`,
      },
    })
    const mockAdapter: Adapter = {
      getSessionAndUser: vi.fn().mockResolvedValue({
        session: expectedSession,
        user: expectedSessionUser,
      }),
      deleteSession: vi.fn().mockResolvedValue(null),
      updateSession: vi.fn().mockResolvedValue(null),

      // not needed for this test but required for the assertion
      createUser: vi.fn().mockResolvedValue(null),
      getUser: vi.fn().mockResolvedValue(null),
      getUserByAccount: vi.fn().mockResolvedValue(null),
      getUserByEmail: vi.fn().mockResolvedValue(null),
      updateUser: vi.fn().mockResolvedValue(null),
      linkAccount: vi.fn().mockResolvedValue(null),
      createSession: vi.fn().mockResolvedValue(null),
    }

    authConfig.adapter = mockAdapter
    const response = (await Auth(request, authConfig)) as Response
    const bodySession = await response.json()

    let cookies = response.headers
      .getSetCookie()
      .reduce<Record<string, string>>((acc, cookie) => {
        return { ...acc, ...parse(cookie) }
      }, {})
    const sessionToken = cookies[SESSION_COOKIE_NAME]
    const decoded = await decode<{
      // TODO: This shouldn't be necessary?
      exp: number
      iat: number
      jti: string
    }>({
      salt: SESSION_COOKIE_NAME,
      secret: AUTH_SECRET,
      token: sessionToken,
    })

    const { exp, iat, jti, ...actualSession } = decoded || {}

    expect(mockAdapter.getSessionAndUser).toHaveBeenCalledOnce()
    expect(mockAdapter.deleteSession).not.toHaveBeenCalled()
    expect(mockAdapter.updateSession).toHaveBeenCalled()
    expect(defaultCallbacks.session).toHaveBeenCalledOnce()
    expect(authConfig.events?.session).toHaveBeenCalledOnce()
    expect(defaultCallbacks.jwt).not.toHaveBeenCalledOnce()

    expect({
      ...actualSession,
      expires: new Date((actualSession as AdapterSession).expires),
    }).toEqual(expectedSession)
    expect(bodySession.user).toEqual(expectedSessionUserInBody)
    expect(bodySession.expires).toEqual(currentExpires.toISOString())
  })
})
