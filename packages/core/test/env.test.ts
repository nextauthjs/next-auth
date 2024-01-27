import { beforeEach, describe, expect, it } from "vitest"

import { AuthConfig } from "../src/index.js"
import { setEnvDefaults } from "../src/lib/utils/env.js"
import Auth0 from "../src/providers/auth0.js"
import Resend from "../src/providers/resend.js"

const testConfig: AuthConfig = {
  providers: [Auth0, Resend({})],
}

let authConfig: AuthConfig

beforeEach(() => {
  authConfig = { ...testConfig } // clone
})

describe("Environment variables are set on config", () => {
  it("client id, client secret, issuer", () => {
    const env = {
      AUTH_AUTH0_ID: "asdf",
      AUTH_AUTH0_SECRET: "fdsa",
      AUTH_AUTH0_ISSUER: "https://example.com",
      AUTH_RESEND_KEY: "resend",
    }
    setEnvDefaults(env, authConfig)
    expect(authConfig.providers[0].clientId).toBe(env.AUTH_AUTH0_ID)
    expect(authConfig.providers[0].clientSecret).toBe(env.AUTH_AUTH0_SECRET)
    expect(authConfig.providers[0].issuer).toBe(env.AUTH_AUTH0_ISSUER)
    expect(authConfig.providers[1].apiKey).toBe(env.AUTH_RESEND_KEY)
  })

  it("AUTH_SECRET", () => {
    const env = { AUTH_SECRET: "secret" }
    setEnvDefaults(env, authConfig)
    expect(authConfig.secret?.[0]).toBe(env.AUTH_SECRET)
  })

  it("AUTH_SECRET, prefer config", () => {
    const env = { AUTH_SECRET: "0", AUTH_SECRET_1: "1" }
    setEnvDefaults(env, authConfig)
    expect(authConfig.secret).toEqual(["1", "0"])
  })

  it("AUTH_SECRET, prefer config", () => {
    const env = { AUTH_SECRET: "new" }
    authConfig.secret = ["old"]
    setEnvDefaults(env, authConfig)
    expect(authConfig.secret).toEqual(["old"])
  })

  it("AUTH_REDIRECT_PROXY_URL", () => {
    const env = { AUTH_REDIRECT_PROXY_URL: "http://example.com" }
    setEnvDefaults(env, authConfig)
    expect(authConfig.redirectProxyUrl).toBe(env.AUTH_REDIRECT_PROXY_URL)
  })

  it("AUTH_URL", () => {
    const env = { AUTH_URL: "http://n/api/auth" }
    setEnvDefaults(env, authConfig)
    expect(authConfig.basePath).toBe("/api/auth")
  })

  it("AUTH_URL + prefer config", () => {
    const env = { AUTH_URL: "http://n/api/auth" }
    const fromConfig = "/basepath-from-config"
    authConfig.basePath = fromConfig
    setEnvDefaults(env, authConfig)
    expect(authConfig.basePath).toBe(fromConfig)
  })

  it("AUTH_URL, but invalid value", () => {
    const env = { AUTH_URL: "secret" }
    setEnvDefaults(env, authConfig)
    expect(authConfig.basePath).toBe("/auth")
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
  })
})
