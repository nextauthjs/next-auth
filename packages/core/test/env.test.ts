import { beforeEach, describe, expect, it } from "vitest"

import { AuthConfig } from "../src/index.js"
import { setEnvDefaults } from "../src/lib/utils/env.js"
import GitHub from "../src/providers/github.js"

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
        AUTH_SECRET:
          "cec8c777201ab63dfde2d29ee577358d98c53cb65c7110c4db23ee78656dd096",
      },
      authConfig
    )
    console.log(authConfig)
    expect(authConfig.secret?.[0]).toEqual(
      "cec8c777201ab63dfde2d29ee577358d98c53cb65c7110c4db23ee78656dd096"
    )
  })
})
