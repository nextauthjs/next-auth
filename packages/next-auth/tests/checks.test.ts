import { compareDates, mockLogger } from "./lib"
import * as checks from "../src/core/lib/oauth/checks"
import { AuthorizationParameters } from "openid-client"
import { Cookie } from "../src/core/lib/cookie"

let options: any

beforeEach(() => {
  options = {
    logger: mockLogger(),
    secret: "secret",
    url: {
      origin: "http://localhost:3000",
      host: "localhost:3000",
      path: "/api/auth",
      base: "http://localhost:3000/api/auth",
      toString: () => "http://localhost:3000/api/auth",
    },
    action: "session",
    provider: {
      type: "oauth",
      id: "testId",
      name: "testName",
      signinUrl: "/",
      callbackUrl: "/",
      checks: ["pkce", "state"],
      profile() {
        return { id: "", name: "", email: "" }
      },
    },
    jwt: {
      secret: "secret",
      maxAge: 0,
      encode() {
        throw new Error("Function not implemented.")
      },
      decode() {
        throw new Error("Function not implemented.")
      },
    },
    cookies: {
      pkceCodeVerifier: { name: "", options: {} },
      state: { name: "", options: {} },
    },
  }
})

describe("PKCE", () => {
  it("sets a code challenge, code challenge method, and cookie", async () => {
    const cookies = []
    const params: AuthorizationParameters = {}
    await checks.pkce.create(options, cookies, params)

    expect(params?.code_challenge).not.toBeNull()
    expect(params?.code_challenge_method).toEqual("S256")
    expect(cookies.length).not.toBe(0)
  })

  it("does not set PKCE values when unsupported", async () => {
    options.provider.checks = ["state"]
    const cookies = []
    const params: AuthorizationParameters = {}
    await checks.pkce.create(options, cookies, params)

    expect(Object.keys(params).length).toBe(0)
    expect(cookies.length).toBe(0)
  })

  it("sets the cookie expiration to a default of 15 minutes when the max age option is not provided", async () => {
    const cookies: Cookie[] = []
    const params: AuthorizationParameters = {}
    await checks.pkce.create(options, cookies, params)

    const defaultMaxAge = 60 * 15 // 15 minutes in seconds
    const expires = new Date()
    expires.setTime(expires.getTime() + defaultMaxAge * 1000)

    compareDates(expires, cookies[0].options.expires)
    expect(cookies[0].options.maxAge).toBeUndefined()
  })

  it("sets the cookie expiration and max age to the provided max age from the options", async () => {
    const maxAge = 60 * 20 // 20 minutes
    options.cookies.pkceCodeVerifier.options.maxAge = maxAge

    const pkceCookies: Cookie[] = []
    const params: AuthorizationParameters = {}
    await checks.pkce.create(options, pkceCookies, params)

    const expires = new Date()
    expires.setTime(expires.getTime() + maxAge * 1000)

    compareDates(expires, pkceCookies[0].options.expires)
    expect(pkceCookies[0].options.maxAge).toEqual(maxAge)
  })
})

describe("state", () => {
  it("returns a state, and cookie", async () => {
    const cookies = []
    const params: AuthorizationParameters = {}
    await checks.state.create(options, cookies, params)

    expect(params.state).toBeDefined()
    expect(cookies.length).not.toBe(0)
  })

  it("does not set state when unsupported", async () => {
    options.provider.checks = ["pkce"]
    const cookies = []
    const params: AuthorizationParameters = {}
    await checks.state.create(options, cookies, params)

    expect(Object.keys(params).length).toBe(0)
    expect(cookies.length).toBe(0)
  })

  it("sets the cookie expiration to a default of 15 minutes when the max age option is not provided", async () => {
    const cookies: Cookie[] = []
    const params: AuthorizationParameters = {}
    await checks.state.create(options, cookies, params)

    const defaultMaxAge = 60 * 15 // 15 minutes in seconds
    const expires = new Date()
    expires.setTime(expires.getTime() + defaultMaxAge * 1000)

    compareDates(expires, cookies[0].options.expires)
    expect(cookies[0].options.maxAge).toBeUndefined()
  })

  it("sets the cookie expiration and max age to the provided max age from the options", async () => {
    const maxAge = 60 * 20 // 20 minutes
    options.cookies.state.options.maxAge = maxAge

    const stateCookies: Cookie[] = []
    const params: AuthorizationParameters = {}
    await checks.state.create(options, stateCookies, params)

    const expires = new Date()
    expires.setTime(expires.getTime() + maxAge * 1000)

    compareDates(expires, stateCookies[0].options.expires)
    expect(stateCookies[0].options.maxAge).toEqual(maxAge)
  })
})
