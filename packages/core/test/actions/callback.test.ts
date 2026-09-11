import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import GitHub from "../../src/providers/github.js"
import Credentials from "../../src/providers/credentials.js"
import MicrosoftEntraID from "../../src/providers/microsoft-entra-id.js"

import { logger, makeAuthRequest, testConfig } from "../utils.js"
import { skipCSRFCheck } from "../../src/index.js"
import { CredentialsSignin, InvalidCheck } from "../../src/errors.js"
import {
  nonce,
  pkce,
  state,
} from "../../src/lib/actions/callback/oauth/checks.js"

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

  describe("Redirect Proxy", () => {
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

describe("OAuth check cookies are bound to their provider", () => {
  const cookieOptions = {
    secure: true,
    sameSite: "lax" as const,
    httpOnly: true,
  }
  const cookies = {
    state: { name: "authjs.state", options: cookieOptions },
    nonce: { name: "authjs.nonce", options: cookieOptions },
    pkceCodeVerifier: {
      name: "authjs.pkce.code_verifier",
      options: cookieOptions,
    },
  }

  function optionsFor(id: string, checks: Array<"state" | "nonce" | "pkce">) {
    return {
      logger,
      provider: { id, checks },
      jwt: { secret: "secret" },
      cookies,
    } as any
  }

  it("accepts a state cookie on the same provider's callback", async () => {
    const created = (await state.create(optionsFor("github", ["state"]))) as any
    const value = await state.use(
      { [cookies.state.name]: created.cookie.value },
      [],
      optionsFor("github", ["state"])
    )
    expect(value).toBe(created.value)
  })

  it("rejects a state cookie minted for a different provider", async () => {
    const created = (await state.create(optionsFor("github", ["state"]))) as any
    await expect(
      state.use(
        { [cookies.state.name]: created.cookie.value },
        [],
        optionsFor("google", ["state"])
      )
    ).rejects.toThrow(InvalidCheck)
  })

  it("rejects a nonce cookie minted for a different provider", async () => {
    const created = (await nonce.create(optionsFor("github", ["nonce"]))) as any
    await expect(
      nonce.use(
        { [cookies.nonce.name]: created.cookie.value },
        [],
        optionsFor("google", ["nonce"])
      )
    ).rejects.toThrow(InvalidCheck)
  })

  it("rejects a PKCE verifier cookie minted for a different provider", async () => {
    const created = (await pkce.create(optionsFor("github", ["pkce"]))) as any
    await expect(
      pkce.use(
        { [cookies.pkceCodeVerifier.name]: created.cookie.value },
        [],
        optionsFor("google", ["pkce"])
      )
    ).rejects.toThrow(InvalidCheck)
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

describe("Microsoft Entra ID common-tenant callback hacks", () => {
  // Token-body errors are handled in the same `conformInternal` gate as the
  // common-tenant `tid` issuer rewrite. Asserting the error mapping is enough
  // to prove a custom provider `id` still enters that block.
  const entraErrorBody = {
    error: "invalid_grant",
    error_description: "AADSTS50148: The code_verifier does not match.",
    error_codes: [50148],
  }

  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input instanceof Request ? input.url : input)
        if (url.includes(".well-known/openid-configuration")) {
          return Response.json({
            token_endpoint:
              "https://login.microsoftonline.com/common/oauth2/v2.0/token",
            authorization_endpoint:
              "https://login.microsoftonline.com/common/oauth2/v2.0/authorize",
            userinfo_endpoint: "https://graph.microsoft.com/oidc/userinfo",
            issuer: "https://login.microsoftonline.com/{tenantid}/v2.0",
            jwks_uri:
              "https://login.microsoftonline.com/common/discovery/v2.0/keys",
          })
        }
        if (url.includes("/oauth2/v2.0/token")) {
          return Response.json(entraErrorBody)
        }
        return new Response(`unexpected fetch: ${url}`, { status: 500 })
      })
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  async function entraCallback(id?: string) {
    return makeAuthRequest({
      action: "callback",
      path: `/${id ?? "microsoft-entra-id"}`,
      query: { code: "test-code" },
      config: {
        providers: [
          MicrosoftEntraID({
            ...(id ? { id } : {}),
            clientId: "client-id",
            clientSecret: "client-secret",
            issuer: "https://login.microsoftonline.com/common/v2.0",
            checks: [],
          }),
        ],
      },
    })
  }

  it("surfaces token-endpoint errors for the default provider id", async () => {
    const { response } = await entraCallback()
    expect(response.status).toEqual(302)
    expect(response.headers.get("location")).toEqual(
      `https://authjs.test/auth/signin?error=OAuthCallbackError`
    )
  })

  it("surfaces token-endpoint errors when the provider id is customized", async () => {
    const { response } = await entraCallback("microsoft_entra_id")
    expect(response.status).toEqual(302)
    expect(response.headers.get("location")).toEqual(
      `https://authjs.test/auth/signin?error=OAuthCallbackError`
    )
  })

  it("surfaces token-endpoint errors for an arbitrary custom provider id", async () => {
    const { response } = await entraCallback("custom-entra")
    expect(response.status).toEqual(302)
    expect(response.headers.get("location")).toEqual(
      `https://authjs.test/auth/signin?error=OAuthCallbackError`
    )
  })
})
