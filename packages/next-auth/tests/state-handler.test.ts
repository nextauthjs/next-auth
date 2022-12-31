import { mockLogger } from "./lib"
import type {
  InternalOptions,
  LoggerInstance,
  InternalProvider,
  CallbacksOptions,
  CookiesOptions,
} from "../src"
import { createState } from "../src/core/lib/oauth/state-handler"
import { InternalUrl } from "../src/utils/parse-url"
import { JWTOptions, encode, decode } from "../src/jwt"

let logger: LoggerInstance
let url: InternalUrl
let provider: InternalProvider<"oauth">
let jwt: JWTOptions
let callbacks: CallbacksOptions
let cookies: CookiesOptions
let options: InternalOptions<"oauth">

beforeEach(() => {
  logger = mockLogger()

  url = {
    origin: "http://localhost:3000",
    host: "localhost:3000",
    path: "/api/auth",
    base: "http://localhost:3000/api/auth",
    toString: () => "http://localhost:3000/api/auth",
  }

  provider = {
    type: "oauth",
    id: "testId",
    name: "testName",
    signinUrl: "/",
    callbackUrl: "/",
    checks: ["pkce", "state"],
    profile() {
      return { id: "", name: "", email: "" }
    },
  }

  jwt = {
    secret: "secret",
    maxAge: 0,
    encode,
    decode,
  }

  callbacks = {
    signIn: function () {
      throw new Error("Function not implemented.")
    },
    redirect: function () {
      throw new Error("Function not implemented.")
    },
    session: function () {
      throw new Error("Function not implemented.")
    },
    jwt: function () {
      throw new Error("Function not implemented.")
    },
  }

  cookies = {
    sessionToken: { name: "", options: undefined },
    callbackUrl: { name: "", options: undefined },
    csrfToken: { name: "", options: undefined },
    pkceCodeVerifier: { name: "", options: undefined },
    state: { name: "", options: {} },
    nonce: { name: "", options: undefined },
  }

  options = {
    url,
    adapter: undefined,
    action: "session",
    provider,
    secret: "",
    debug: false,
    logger,
    session: {
      strategy: "jwt",
      maxAge: 0,
      updateAge: 0,
      generateSessionToken() {
        return ""
      },
    },
    pages: {},
    jwt,
    events: {},
    callbacks,
    cookies,
    callbackUrl: "",
    providers: [],
    theme: {},
  }
})

describe("createState", () => {
  it("returns a state, and cookie", async () => {
    const state = await createState(options)

    expect(state?.value).not.toBeNull()
    expect(state?.cookie).not.toBeNull()
  })
  it("does not return a state when the provider does not support state", async () => {
    options.provider.checks = ["pkce"]

    const state = await createState(options)

    expect(state).toBeUndefined()
  })
  it("sets the cookie expiration to a default of 15 minutes when the max age option is not provided", async () => {
    const state = await createState(options)

    const defaultMaxAge = 60 * 15 // 15 minutes in seconds
    const expires = new Date()
    expires.setTime(expires.getTime() + defaultMaxAge * 1000)

    validateCookieExpiration({ state, expires })
    expect(state?.cookie.options.maxAge).toBeUndefined()
  })

  it("sets the cookie expiration and max age to the provided max age from the options", async () => {
    const maxAge = 60 * 20 // 20 minutes
    cookies.state.options.maxAge = maxAge

    const state = await createState(options)

    const expires = new Date()
    expires.setTime(expires.getTime() + maxAge * 1000)

    validateCookieExpiration({ state, expires })
    expect(state?.cookie.options.maxAge).toEqual(maxAge)
  })
})

// comparing the parts instead of getTime() because the milliseconds
// will not match since the two Date objects are created milliseconds apart
const validateCookieExpiration = ({ state, expires }) => {
  const cookieExpires = state?.cookie.options.expires
  expect(cookieExpires.getFullYear()).toEqual(expires.getFullYear())
  expect(cookieExpires.getMonth()).toEqual(expires.getMonth())
  expect(cookieExpires.getFullYear()).toEqual(expires.getFullYear())
  expect(cookieExpires.getHours()).toEqual(expires.getHours())
  expect(cookieExpires.getMinutes()).toEqual(expires.getMinutes())
}
