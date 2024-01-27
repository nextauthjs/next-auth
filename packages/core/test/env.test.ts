import { beforeEach, describe, expect, it, vi } from "vitest"

import { Auth, AuthConfig } from "../src/index.js"
import { setEnvDefaults } from "../src/lib/utils/env.js"
import GitHub from "../src/providers/github.js"
import {
  AUTH_SECRET,
  CALLBACK_ACTION,
  ERROR_ACTION,
  SESSION_ACTION,
  SESSION_COOKIE_NAME,
} from "./constants.js"

const testConfig: AuthConfig = {
  providers: [GitHub],
  trustHost: true,
  basePath: "/api/auth",
}

describe("Environment Vars", () => {
  let authConfig: AuthConfig

  beforeEach(() => {
    authConfig = testConfig
  })

  it("should set the clientId/clientSecret on the provider", () => {
    setEnvDefaults(
      {
        AUTH_GITHUB_ID: "asdf",
        AUTH_GITHUB_SECRET: "fdsa",
      },
      authConfig
    )
    expect(authConfig.providers[0].clientId).toEqual("asdf")
    expect(authConfig.providers[0].clientSecret).toEqual("fdsa")
  })
  it("should set the AUTH_SECRET", () => {
    setEnvDefaults(
      {
        AUTH_SECRET: "aaaaaa",
      },
      authConfig
    )
    console.log(authConfig)
    expect(authConfig.secret?.[0]).toEqual("aaaaaa")
  })
})
