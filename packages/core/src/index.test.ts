import { describe, expect, it, vi } from "vitest"
import { Auth, AuthConfig } from "./index.js"
import GitHub from "./providers/github"
import {
  AUTH_SECRET,
  SESSION_ACTION,
  SESSION_COOKIE_NAME,
} from "./test/constants.js"
import { decode, encode } from "./jwt.js"
import { parse } from "cookie"

const authConfig: AuthConfig = {
  providers: [GitHub],
  trustHost: true,
  secret: AUTH_SECRET,
}

describe("JWT session", () => {
  it("should return a valid JWT session response", async () => {
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
    const authEvents: AuthConfig['events'] = {
      session(message) {
        console.log("session event: ", message)
      }
    }
    vi.spyOn(authEvents, "session").mockImplementation((message) => {
      console.log("session event: ", message)
    })
    authConfig.events = authEvents
    const authCallbacks: AuthConfig['callbacks'] = {
      jwt: async ({ token }) => {
        return token
      },
      session: async ({ session, token }) => {
        return session
      }
    }
    vi.spyOn(authCallbacks, "jwt").mockImplementation(async ({ token }) => {
      console.log("jwt callback: ", { token })
      return token
    })
    vi.spyOn(authCallbacks, "session").mockImplementation(async ({ session, token }) => {
      console.log("session callback: ", { session, token })
      return session
    })
    authConfig.callbacks = authCallbacks
    const response = (await Auth(request, authConfig)) as Response
    const bodySession = await response.json()

    let cookies = {} as Record<string, string>
    for (const [name, value] of response.headers.entries()) {
      if (name === "set-cookie") {
        const cookie = parse(value)
        cookies = { ...cookies, ...cookie }
      }
    }
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
    expect(authConfig.callbacks?.jwt).toHaveBeenCalledOnce()
    expect(authConfig.callbacks?.session).toHaveBeenCalledOnce()
  })
  it("should return null if no JWT session in the requests cookies", async () => {
    const request = new Request(SESSION_ACTION)
    const response = (await Auth(request, authConfig)) as Response
    const actual = await response.json()
    expect(actual).toEqual(null)
  })
})
