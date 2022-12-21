import { mockLogger } from "./lib"
import type {
  InternalOptions,
  LoggerInstance,
  InternalProvider,
  CallbacksOptions,
  Awaitable,
  CookiesOptions,
} from "../src"
import { createPKCE } from "../src/core/lib/oauth/pkce-handler"
import { InternalUrl } from "../src/utils/parse-url"
import { JWT, JWTDecodeParams, JWTEncodeParams, JWTOptions } from "../src/jwt"

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
    encode: function (params: JWTEncodeParams): Awaitable<string> {
      throw new Error("Function not implemented.")
    },
    decode: function (params: JWTDecodeParams): Awaitable<JWT | null> {
      throw new Error("Function not implemented.")
    },
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
    pkceCodeVerifier: { name: "", options: {} },
    state: { name: "", options: undefined },
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

describe("createPKCE", () => {
  it("returns a code challenge, code challenge method, and cookie", async () => {
    const pkce = await createPKCE(options)

    expect(pkce?.code_challenge).not.toBeNull()
    expect(pkce?.code_challenge_method).toEqual("S256")
    expect(pkce?.cookie).not.toBeNull()
  })
  it("does not return a pkce when the provider does not support pkce", async () => {
    options.provider.checks = ["state"]

    const pkce = await createPKCE(options)

    expect(pkce).toBeUndefined()
  })
  it("sets the cookie expiration to a default of 15 minutes when the max age option is not provided", async () => {
    const pkce = await createPKCE(options)

    const defaultMaxAge = 60 * 15 // 15 minutes in seconds
    const expires = new Date()
    expires.setTime(expires.getTime() + defaultMaxAge * 1000)

    validateCookieExpiration({ pkce, expires })
    expect(pkce?.cookie.options.maxAge).toBeUndefined()
  })

  it("sets the cookie expiration and max age to the provided max age from the options", async () => {
    const maxAge = 60 * 20 // 20 minutes
    cookies.pkceCodeVerifier.options.maxAge = maxAge

    const pkce = await createPKCE(options)

    const expires = new Date()
    expires.setTime(expires.getTime() + maxAge * 1000)

    validateCookieExpiration({ pkce, expires })
    expect(pkce?.cookie.options.maxAge).toEqual(maxAge)
  })
})

// comparing the parts instead of getTime() because the milliseconds
// will not match since the two Date objects are created milliseconds apart
const validateCookieExpiration = ({ pkce, expires }) => {
  const cookieExpires = pkce?.cookie.options.expires
  expect(cookieExpires.getFullYear()).toEqual(expires.getFullYear())
  expect(cookieExpires.getMonth()).toEqual(expires.getMonth())
  expect(cookieExpires.getFullYear()).toEqual(expires.getFullYear())
  expect(cookieExpires.getHours()).toEqual(expires.getHours())
  expect(cookieExpires.getMinutes()).toEqual(expires.getMinutes())
}
