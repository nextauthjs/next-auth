import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import * as jose from "jose"
import * as o from "oauth4webapi"

import GitHub from "../../src/providers/github.js"
import Credentials from "../../src/providers/credentials.js"

import { logger, makeAuthRequest, testConfig } from "../utils.js"
import { skipCSRFCheck } from "../../src/index.js"
import { CredentialsSignin, InvalidCheck } from "../../src/errors.js"
import { state } from "../../src/lib/actions/callback/oauth/checks.js"

describe("assert GET callback action", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  afterEach(() => {
    vi.restoreAllMocks()
  })
  it("should throw Configuration error if the provider ID is not found", async () => {
    const { response } = await makeAuthRequest({
      action: "callback",
      path: "/invalid-provider",
    })

    expect(response.status).toEqual(302)
    expect(response.headers.get("location")).toEqual(
      `https://authjs.test/auth/error?error=Configuration`
    )
  })

  describe.only("Redirect Proxy", () => {
    it("should throw Configuration error if missing query state and isOnRedirectProxy is true", async () => {
      const { response } = await makeAuthRequest({
        action: "callback",
        path: "/github",
        query: { state: "random" },
        config: {
          redirectProxyUrl: "https://login.example.com",
          providers: [GitHub],
        },
      })

      expect(response.status).toEqual(302)
      expect(response.headers.get("location")).toEqual(
        `https://authjs.test/auth/error?error=Configuration`
      )
    })

    it("should redirect query with state if redirectProxyUrl is defined, and state query contains origin", async () => {
      const proxyURL = "https://login.example.com/auth"
      const originURL = "https://origin.example.com"

      const config = testConfig({
        debug: true,
        redirectProxyUrl: proxyURL,
        providers: [GitHub],
      })

      const stateCookie = (await state.create(
        {
          logger: config.logger,
          provider: { checks: ["state"] },
          jwt: { secret: config.secret },
          cookies: {
            state: {
              name: "authjs.state",
              options: { secure: true, sameSite: "lax", httpOnly: true },
            },
          },
        } as any,
        originURL
      )) as any

      const params = { state: stateCookie?.value, code: "random" }
      const { response } = await makeAuthRequest({
        action: "callback",
        path: "/github",
        query: params,
        host: "login.example.com",
        config,
      })

      expect(response.status).toEqual(302)
      expect(response.headers.get("location")).toEqual(
        `${originURL}?${new URLSearchParams(params)}`
      )
    })

    it("should error if secret does not match and state cannot be decoded", async () => {
      const proxyURL = "https://login.example.com/auth"
      const originURL = "https://origin.example.com"

      const config = testConfig({
        logger,
        debug: true,
        redirectProxyUrl: proxyURL,
        providers: [GitHub],
      })

      const stateCookie = (await state.create(
        {
          logger: config.logger,
          provider: { checks: ["state"] },
          jwt: { secret: "something random" },
          cookies: {
            state: {
              name: "authjs.state",
              options: { secure: true, sameSite: "lax", httpOnly: true },
            },
          },
        } as any,
        originURL
      )) as any

      const params = { state: stateCookie?.value, code: "random" }
      const { response } = await makeAuthRequest({
        action: "callback",
        path: "/github",
        query: params,
        host: "login.example.com",
        config,
      })

      expect(response.status).toEqual(302)
      expect(response.headers.get("location")).toEqual(
        `${proxyURL}/error?${new URLSearchParams({ error: "Configuration" })}`
      )
      expect(logger.error).toHaveBeenCalledWith(
        new InvalidCheck("State could not be decoded")
      )
    })
  })

  it("should redirect to the custom error page is custom error page is defined", async () => {
    const { response } = await makeAuthRequest({
      action: "callback",
      path: "/credentials",
      config: {
        pages: {
          error: "/custom/error",
        },
        providers: [Credentials],
      },
    })

    expect(response.status).toEqual(302)
    expect(response.headers.get("location")).toEqual(
      `https://authjs.test/custom/error?error=Configuration`
    )
  })
})

describe("assert POST callback action", () => {
  describe("Credentials provider", () => {
    it("should return error=CredentialSignin and code=credentials if authorize returns null", async () => {
      const { response } = await makeAuthRequest({
        action: "callback",
        path: "/credentials",
        body: {
          username: "foo",
          password: "bar",
        },
        config: {
          skipCSRFCheck,
          providers: [
            Credentials({
              authorize() {
                return null
              },
            }),
          ],
        },
      })

      expect(response.status).toEqual(302)
      expect(response.headers.get("location")).toEqual(
        `https://authjs.test/auth/signin?error=CredentialsSignin&code=credentials`
      )
    })

    it("should return error=Configuration if authorize throws an Error that is not extending from CredentialSignin", async () => {
      const { response } = await makeAuthRequest({
        action: "callback",
        path: "/credentials",
        body: {
          username: "foo",
          password: "bar",
        },
        config: {
          skipCSRFCheck,
          providers: [
            Credentials({
              authorize() {
                throw new Error()
              },
            }),
          ],
        },
      })

      expect(response.status).toEqual(302)
      expect(response.headers.get("location")).toEqual(
        `https://authjs.test/auth/error?error=Configuration`
      )
    })

    it("should return error=CredentialsSignin and code=custom if authorize throws an custom Error that is extending from CredentialSignin", async () => {
      class CustomSigninError extends CredentialsSignin {
        code = "custom"
      }
      const { response } = await makeAuthRequest({
        action: "callback",
        path: "/credentials",
        body: {
          username: "foo",
          password: "bar",
        },
        config: {
          skipCSRFCheck,
          providers: [
            Credentials({
              authorize() {
                throw new CustomSigninError()
              },
            }),
          ],
        },
      })

      expect(response.status).toEqual(302)
      expect(response.headers.get("location")).toEqual(
        `https://authjs.test/auth/signin?error=CredentialsSignin&code=custom`
      )
    })
  })
})
