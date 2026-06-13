import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import MicrosoftEntraID from "../../src/providers/microsoft-entra-id"
import { customFetch } from "../../src/lib/symbols"

const DISCOVERY_BODY = {
  issuer: "https://login.microsoftonline.com/{tenantid}/v2.0",
  authorization_endpoint:
    "https://login.microsoftonline.com/{tenantid}/oauth2/v2.0/authorize",
  token_endpoint:
    "https://login.microsoftonline.com/{tenantid}/oauth2/v2.0/token",
  userinfo_endpoint: "https://graph.microsoft.com/oidc/userinfo",
  jwks_uri: "https://login.microsoftonline.com/{tenantid}/discovery/v2.0/keys",
}

function mockDiscovery() {
  return vi.fn(async () => Response.json(DISCOVERY_BODY))
}

describe("MicrosoftEntraID provider", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockDiscovery())
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("defaults to the /common multi-tenant issuer", () => {
    const provider = MicrosoftEntraID({
      clientId: "id",
      clientSecret: "secret",
    })
    expect(provider.id).toBe("microsoft-entra-id")
    expect(provider.type).toBe("oidc")
    expect(provider.options?.issuer).toBe(
      "https://login.microsoftonline.com/common/v2.0"
    )
  })

  it("rewrites the discovery issuer using the tenant from the request URL", async () => {
    const provider = MicrosoftEntraID({
      clientId: "id",
      clientSecret: "secret",
    })

    const tid = "8a2a7b4d-1234-5678-9abc-def012345678"
    const url = `https://login.microsoftonline.com/${tid}/v2.0/.well-known/openid-configuration`
    const response = await provider[customFetch]!(url)
    const json = await response.json()

    expect(json.issuer).toBe(`https://login.microsoftonline.com/${tid}/v2.0`)
  })

  it("rewrites the discovery issuer for the /common endpoint", async () => {
    const provider = MicrosoftEntraID({
      clientId: "id",
      clientSecret: "secret",
    })

    const url =
      "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration"
    const response = await provider[customFetch]!(url)
    const json = await response.json()

    expect(json.issuer).toBe("https://login.microsoftonline.com/common/v2.0")
  })

  it("rewrites the discovery issuer for /organizations and /consumers endpoints", async () => {
    const provider = MicrosoftEntraID({
      clientId: "id",
      clientSecret: "secret",
    })

    for (const tenant of ["organizations", "consumers"]) {
      const url = `https://login.microsoftonline.com/${tenant}/v2.0/.well-known/openid-configuration`
      const response = await provider[customFetch]!(url)
      const json = await response.json()
      expect(json.issuer).toBe(
        `https://login.microsoftonline.com/${tenant}/v2.0`
      )
    }
  })

  it("preserves a configured single-tenant issuer through discovery", async () => {
    const tid = "8a2a7b4d-1234-5678-9abc-def012345678"
    const provider = MicrosoftEntraID({
      clientId: "id",
      clientSecret: "secret",
      issuer: `https://login.microsoftonline.com/${tid}/v2.0`,
    })

    const url = `https://login.microsoftonline.com/${tid}/v2.0/.well-known/openid-configuration`
    const response = await provider[customFetch]!(url)
    const json = await response.json()

    expect(json.issuer).toBe(`https://login.microsoftonline.com/${tid}/v2.0`)
  })

  it("passes non-discovery requests through to fetch unchanged", async () => {
    const provider = MicrosoftEntraID({
      clientId: "id",
      clientSecret: "secret",
    })

    const fetchMock = vi.fn(async () => new Response("token"))
    vi.stubGlobal("fetch", fetchMock)

    const url = "https://login.microsoftonline.com/common/oauth2/v2.0/token"
    await provider[customFetch]!(url)

    expect(fetchMock).toHaveBeenCalledOnce()
    expect(fetchMock.mock.calls[0][0]).toBe(url)
  })
})
