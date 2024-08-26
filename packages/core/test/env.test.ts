import { beforeEach, describe, expect, it, vi } from "vitest"

import { AuthConfig } from "../src/index.js"
import { setEnvDefaults, createActionURL } from "../src/lib/utils/env.js"
import Auth0 from "../src/providers/auth0.js"
import Resend from "../src/providers/resend.js"

const logger = { warn: vi.fn() }

describe("config is inferred from environment variables", () => {
  const testConfig: AuthConfig = {
    providers: [Auth0, Resend({})],
    logger,
  }

  let authConfig: AuthConfig

  beforeEach(() => {
    authConfig = { ...testConfig } // clone
    vi.resetAllMocks()
  })

  it("providers (client id, client secret, issuer, api key)", () => {
    const env = {
      AUTH_AUTH0_ID: "asdf",
      AUTH_AUTH0_SECRET: "fdsa",
      AUTH_AUTH0_ISSUER: "https://example.com",
      AUTH_RESEND_KEY: "resend",
    }
    setEnvDefaults(env, authConfig)
    const [p1, p2] = authConfig.providers
    // @ts-expect-error
    expect(p1.clientId).toBe(env.AUTH_AUTH0_ID)
    // @ts-expect-error
    expect(p1.clientSecret).toBe(env.AUTH_AUTH0_SECRET)
    // @ts-expect-error
    expect(p1.issuer).toBe(env.AUTH_AUTH0_ISSUER)
    // @ts-expect-error
    expect(p2.apiKey).toBe(env.AUTH_RESEND_KEY)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("AUTH_SECRET", () => {
    const env = { AUTH_SECRET: "secret" }
    setEnvDefaults(env, authConfig)
    expect(authConfig.secret?.[0]).toBe(env.AUTH_SECRET)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("AUTH_SECRET, prefer config", () => {
    const env = { AUTH_SECRET: "0", AUTH_SECRET_1: "1" }
    setEnvDefaults(env, authConfig)
    expect(authConfig.secret).toEqual(["1", "0"])
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("AUTH_SECRET, prefer config", () => {
    const env = { AUTH_SECRET: "new" }
    authConfig.secret = ["old"]
    setEnvDefaults(env, authConfig)
    expect(authConfig.secret).toEqual(["old"])
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("AUTH_REDIRECT_PROXY_URL", () => {
    const env = { AUTH_REDIRECT_PROXY_URL: "http://example.com" }
    setEnvDefaults(env, authConfig)
    expect(authConfig.redirectProxyUrl).toBe(env.AUTH_REDIRECT_PROXY_URL)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("AUTH_URL", () => {
    const env = { AUTH_URL: "http://n/api/auth" }
    setEnvDefaults(env, authConfig)
    expect(authConfig.basePath).toBe("/api/auth")
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("AUTH_URL + prefer config", () => {
    const env = { AUTH_URL: "http://n/api/auth" }
    const fromConfig = "/basepath-from-config"
    authConfig.basePath = fromConfig
    setEnvDefaults(env, authConfig)
    expect(authConfig.basePath).toBe(fromConfig)
    expect(logger.warn).toHaveBeenCalledWith("env-url-basepath-redundant")
  })

  it("AUTH_URL + prefer config but suppress base path waring", () => {
    const env = { AUTH_URL: "http://n/api/auth" }
    const fromConfig = "/basepath-from-config"
    authConfig.basePath = fromConfig
    setEnvDefaults(env, authConfig, true)
    expect(authConfig.basePath).toBe(fromConfig)
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it("AUTH_URL, but invalid value", () => {
    const env = { AUTH_URL: "secret" }
    setEnvDefaults(env, authConfig)
    expect(authConfig.basePath).toBe("/auth")
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it.each([
    [{ AUTH_TRUST_HOST: "1" }, { trustHost: true }],
    [{ VERCEL: "1" }, { trustHost: true }],
    [{ NODE_ENV: "development" }, { trustHost: true }],
    [{ NODE_ENV: "test" }, { trustHost: true }],
    [{ AUTH_URL: "http://example.com" }, { trustHost: true }],
  ])(`%j`, (env, expected) => {
    setEnvDefaults(env, authConfig)
    expect(authConfig).toMatchObject(expected)
    expect(logger.warn).not.toHaveBeenCalled()
  })
})

describe("createActionURL", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it.each([
    {
      args: {
        action: "callback",
        protocol: undefined,
        headers: new Headers({ host: "example.com" }),
        env: {},
        config: { basePath: "/basepath" },
      },
      expected: "https://example.com/basepath/callback",
    },
    {
      args: {
        action: "session",
        protocol: "http",
        headers: new Headers({ host: "example.com" }),
        env: {},
        config: { basePath: "/auth" },
      },
      expected: "http://example.com/auth/session",
    },
    {
      args: {
        action: "session",
        protocol: "http",
        headers: new Headers({
          host: "127.0.0.1",
          "x-forwarded-host": "example.com",
        }),
        env: {},
        config: { basePath: "/auth" },
      },
      expected: "http://example.com/auth/session",
    },
    {
      args: {
        action: "signin",
        protocol: "http",
        headers: new Headers({
          "x-forwarded-host": "example.com",
          "x-forwarded-proto": "https",
        }),
        env: {},
        config: { basePath: "/auth" },
      },
      expected: "https://example.com/auth/signin",
    },
    {
      args: {
        action: "signin",
        protocol: "http:",
        headers: new Headers({
          "x-forwarded-host": "example.com",
        }),
        env: {},
        config: { basePath: "/auth" },
      },
      expected: "http://example.com/auth/signin",
    },
    {
      args: {
        action: "signin",
        protocol: "https:",
        headers: new Headers({
          "x-forwarded-host": "example.com",
        }),
        env: {},
        config: { basePath: "/auth" },
      },
      expected: "https://example.com/auth/signin",
    },
    {
      args: {
        action: "signin",
        protocol: undefined,
        headers: new Headers({
          "x-forwarded-host": "example.com",
          "x-forwarded-proto": "https",
        }),
        env: {},
        config: { basePath: "/auth" },
      },
      expected: "https://example.com/auth/signin",
    },
    {
      args: {
        action: "signin",
        protocol: undefined,
        headers: new Headers({
          "x-forwarded-host": "example.com",
          "x-forwarded-proto": "http",
        }),
        env: {},
        config: { basePath: "/auth" },
      },
      expected: "http://example.com/auth/signin",
    },
    {
      args: {
        action: "signout",
        protocol: undefined,
        headers: new Headers({}),
        env: { AUTH_URL: "http://localhost:3000" },
        config: { basePath: "/api/auth" },
      },
      expected: "http://localhost:3000/api/auth/signout",
    },
    {
      args: {
        action: "signout",
        protocol: undefined,
        headers: new Headers({}),
        env: { AUTH_URL: "https://sub.domain.env.com" },
        config: { basePath: "/api/auth" },
      },
      expected: "https://sub.domain.env.com/api/auth/signout",
    },
    {
      args: {
        action: "signout",
        protocol: undefined,
        headers: new Headers({}),
        env: { AUTH_URL: "https://sub.domain.env.com/api/auth" },
        config: { basePath: undefined },
      },
      expected: "https://sub.domain.env.com/api/auth/signout",
    },
    {
      args: {
        action: "signout",
        protocol: undefined,
        headers: new Headers({}),
        env: { AUTH_URL: "http://localhost:3000/my-app/api/auth" },
        config: { basePath: "/my-app/api/auth" },
      },
      expected: "http://localhost:3000/my-app/api/auth/signout",
    },
  ])("%j", ({ args, expected }) => {
    const argsWithLogger = { ...args, config: { ...args.config, logger } }
    // @ts-expect-error
    expect(createActionURL(...Object.values(argsWithLogger)).toString()).toBe(
      expected
    )
    expect(logger.warn).not.toHaveBeenCalled()
  })

  it.each([
    {
      args: {
        action: "signout",
        protocol: undefined,
        headers: new Headers({}),
        env: { AUTH_URL: "http://localhost:3000/my-app/api/auth/" },
        config: { basePath: "/my-app/api/auth" },
      },
      expected: {
        url: "http://localhost:3000/my-app/api/auth/signout",
        warningMessage: "env-url-basepath-mismatch",
      },
    },
    {
      args: {
        action: "signout",
        protocol: undefined,
        headers: new Headers({}),
        env: { AUTH_URL: "https://sub.domain.env.com/my-app" },
        config: { basePath: "/api/auth" },
      },
      expected: {
        url: "https://sub.domain.env.com/api/auth/signout",
        warningMessage: "env-url-basepath-mismatch",
      },
    },
  ])("Duplicate path configurations: %j", ({ args, expected }) => {
    const argsWithLogger = { ...args, config: { ...args.config, logger } }
    // @ts-expect-error
    expect(createActionURL(...Object.values(argsWithLogger)).toString()).toBe(
      expected.url
    )
    expect(logger.warn).toHaveBeenCalledWith(expected.warningMessage)
  })
})
