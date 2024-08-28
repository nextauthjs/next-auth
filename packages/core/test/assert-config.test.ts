import { vi, expect, it, describe, beforeEach } from "vitest"
import { makeAuthRequest } from "./utils"
import {
  InvalidCallbackUrl,
  InvalidEndpoints,
  MissingAuthorize,
  MissingSecret,
  UnsupportedStrategy,
  UntrustedHost,
} from "../src/errors"
import { Provider } from "../src/providers"
import { AuthConfig } from "../src"
import Credentials from "../src/providers/credentials"

describe("Assert user config correctness", () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it("missing secret", async () => {
    const { response, logger } = await makeAuthRequest({
      action: "session",
      config: { secret: undefined },
    })

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      message:
        "There was a problem with the server configuration. Check the server logs for more information.",
    })
    expect(logger?.error).toHaveBeenCalledWith(
      new MissingSecret("Please define a `secret`")
    )
  })

  it("trust host", async () => {
    const { response, logger } = await makeAuthRequest({
      action: "session",
      config: { trustHost: false },
    })

    expect(response.status).toBe(500)
    expect(await response.json()).toEqual({
      message:
        "There was a problem with the server configuration. Check the server logs for more information.",
    })
    expect(logger?.error).toHaveBeenCalledWith(
      new UntrustedHost(
        "Host must be trusted. URL was: https://authjs.test/auth/session"
      )
    )
  })

  describe.each(["non-relative", "a"])(
    'invalid callbackUrl (url: "%s")',
    async (callbackUrl) => {
      it.each(["search param", "cookie", "cookie-custom"])(
        "from %s",
        async (type) => {
          const cookieName =
            type === "cookie" ? "__Secure-authjs.callback-url" : "custom-name"

          const { response, logger } = await makeAuthRequest({
            action: "session",
            ...(type.startsWith("cookie")
              ? { cookies: { [cookieName]: callbackUrl } }
              : { query: { callbackUrl } }),
            config: {
              cookies:
                type === "cookie-custom"
                  ? { callbackUrl: { name: cookieName } }
                  : undefined,
            },
          })

          expect(response.status).toBe(500)
          expect(await response.json()).toEqual({
            message:
              "There was a problem with the server configuration. Check the server logs for more information.",
          })
          expect(logger?.error).toHaveBeenCalledWith(
            new InvalidCallbackUrl(
              `Invalid callback URL. Received: ${callbackUrl}`
            )
          )
        }
      )
    }
  )

  describe("providers", () => {
    it.each<[Provider, string]>([
      [
        () => ({ type: "oidc", id: "provider-id", name: "" }),
        'Provider "provider-id" is missing both `issuer` and `authorization` endpoint config. At least one of them is required',
      ],
      [
        { type: "oidc", id: "provider-id", name: "" },
        'Provider "provider-id" is missing both `issuer` and `authorization` endpoint config. At least one of them is required',
      ],
      [
        {
          authorization: { url: "http://a" },
          type: "oauth",
          id: "provider-id",
          name: "",
        },
        'Provider "provider-id" is missing both `issuer` and `token` endpoint config. At least one of them is required',
      ],
      [
        {
          authorization: "http://a",
          token: { url: "http://a" },
          type: "oauth",
          id: "provider-id",
          name: "",
        },
        'Provider "provider-id" is missing both `issuer` and `userinfo` endpoint config. At least one of them is required',
      ],
      [
        {
          authorization: "http://a",
          token: "http://a",
          // @ts-expect-error Purposefully testing invalid config
          userinfo: { foo: "http://a" },
          type: "oauth",
          id: "oauth-provider",
          name: "",
        },
        'Provider "oauth-provider" is missing both `issuer` and `userinfo` endpoint config. At least one of them is required',
      ],
    ])("OAuth/OIDC: invalid endpoints %j", async (provider, error) => {
      const { response, logger } = await makeAuthRequest({
        action: "providers",
        config: { providers: [provider] },
      })

      expect(response.status).toBe(500)
      expect(await response.json()).toEqual({
        message:
          "There was a problem with the server configuration. Check the server logs for more information.",
      })
      expect(logger?.error).toHaveBeenCalledWith(new InvalidEndpoints(error))
    })

    it.each<[string, Provider, Error, Partial<AuthConfig>]>([
      [
        "missing authorize() (function)",
        () => ({ type: "credentials", id: "provider-id", name: "" }),
        new MissingAuthorize(
          "Must define an authorize() handler to use credentials authentication provider"
        ),
      ],
      [
        "missing authorize() (object)",
        { type: "credentials", id: "provider-id", name: "" },
        new MissingAuthorize(
          "Must define an authorize() handler to use credentials authentication provider"
        ),
      ],
      [
        "trying to use database strategy",
        Credentials({}),
        new UnsupportedStrategy(
          "Signing in with credentials only supported if JWT strategy is enabled"
        ),
        { session: { strategy: "database" } },
      ],
    ] as any)("credentials: %s", async (_, provider, error, config) => {
      const { response, logger } = await makeAuthRequest({
        action: "providers",
        config: { ...config, providers: [provider] },
      })

      expect(response.status).toBe(500)
      expect(await response.json()).toEqual({
        message:
          "There was a problem with the server configuration. Check the server logs for more information.",
      })
      expect(logger?.error).toHaveBeenCalledWith(error)
    })
  })
})
