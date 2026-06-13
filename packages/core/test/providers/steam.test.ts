import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import Steam from "../../src/providers/steam"

const STEAM_AUTHORIZATION_URL = "https://steamcommunity.com/openid/login"
const STEAM_OPENID_NS = "http://specs.openid.net/auth/2.0"
const FAKE_STEAM_ID = "76561198000000001"
const FAKE_CLAIMED_ID = `https://steamcommunity.com/openid/id/${FAKE_STEAM_ID}`

describe("Steam provider", () => {
  beforeEach(() => {
    process.env.AUTH_URL = "https://example.com"
  })

  afterEach(() => {
    delete process.env.AUTH_URL
    vi.restoreAllMocks()
  })

  // ---------------------------------------------------------------------------
  // Config shape
  // ---------------------------------------------------------------------------

  it("returns the correct provider id, name and type", () => {
    const provider = Steam({ clientSecret: "test-key" })
    expect(provider.id).toBe("steam")
    expect(provider.name).toBe("Steam")
    expect(provider.type).toBe("oauth")
  })

  it("sets checks to ['none'] because Steam uses OpenID 2.0 not OAuth 2.0", () => {
    const provider = Steam({ clientSecret: "test-key" })
    expect(provider.checks).toEqual(["none"])
  })

  it("throws if clientSecret is missing", () => {
    expect(() => Steam({ clientSecret: "" })).toThrow(/clientSecret/)
  })

  // ---------------------------------------------------------------------------
  // Authorization URL construction
  // ---------------------------------------------------------------------------

  it("builds the correct OpenID 2.0 authorization params", () => {
    const provider = Steam({ clientSecret: "test-key" })
    const auth = provider.authorization as {
      url: string
      params: Record<string, string>
    }

    expect(auth.url).toBe(STEAM_AUTHORIZATION_URL)
    expect(auth.params["openid.ns"]).toBe(STEAM_OPENID_NS)
    expect(auth.params["openid.mode"]).toBe("checkid_setup")
    expect(auth.params["openid.identity"]).toBe(
      "http://specs.openid.net/auth/2.0/identifier_select"
    )
    expect(auth.params["openid.claimed_id"]).toBe(
      "http://specs.openid.net/auth/2.0/identifier_select"
    )
    expect(auth.params["openid.return_to"]).toContain("/steam")
    expect(auth.params["openid.realm"]).toBe("https://example.com")
  })

  it("uses a custom callbackUrl when provided", () => {
    const provider = Steam({
      clientSecret: "test-key",
      callbackUrl: "https://custom.example.com/auth/callback",
    })
    const auth = provider.authorization as {
      url: string
      params: Record<string, string>
    }

    expect(auth.params["openid.realm"]).toBe("https://custom.example.com")
    expect(auth.params["openid.return_to"]).toBe(
      "https://custom.example.com/auth/callback/steam"
    )
  })

  // ---------------------------------------------------------------------------
  // Profile mapping
  // ---------------------------------------------------------------------------

  it("maps the Steam profile to the Auth.js user shape", () => {
    const provider = Steam({ clientSecret: "test-key" })

    const steamProfile = {
      steamid: FAKE_STEAM_ID,
      personaname: "TestPlayer",
      avatarfull: "https://cdn.cloudflare.steamstatic.com/avatar_full.jpg",
      profileurl: `https://steamcommunity.com/profiles/${FAKE_STEAM_ID}/`,
      avatar: "https://cdn.cloudflare.steamstatic.com/avatar.jpg",
      avatarmedium: "https://cdn.cloudflare.steamstatic.com/avatar_medium.jpg",
      avatarhash: "abc123",
      lastlogoff: 1700000000,
      personastate: 1,
      communityvisibilitystate: 3,
      profilestate: 1,
      primaryclanid: "103582791429521408",
      timecreated: 1200000000,
      personastateflags: 0,
    }

    const mapped = provider.profile!(steamProfile, {} as any)

    expect(mapped.id).toBe(FAKE_STEAM_ID)
    expect(mapped.name).toBe("TestPlayer")
    expect(mapped.image).toBe(
      "https://cdn.cloudflare.steamstatic.com/avatar_full.jpg"
    )
    expect(mapped.email).toContain(FAKE_STEAM_ID)
    expect(mapped.email).toContain("steamcommunity.com")
  })

  // ---------------------------------------------------------------------------
  // token.request — OpenID 2.0 assertion verification
  // ---------------------------------------------------------------------------

  it("token.request verifies the OpenID assertion and returns the Steam ID as access_token", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => `ns:${STEAM_OPENID_NS}\nis_valid:true\n`,
      })
    )

    const provider = Steam({ clientSecret: "test-key" })
    const tokenHandler = provider.token as {
      request: (ctx: any) => Promise<{ tokens: any }>
    }

    const result = await tokenHandler.request({
      params: {
        "openid.op_endpoint": STEAM_AUTHORIZATION_URL,
        "openid.ns": STEAM_OPENID_NS,
        "openid.claimed_id": FAKE_CLAIMED_ID,
        "openid.identity": FAKE_CLAIMED_ID,
        "openid.return_to": "https://example.com/api/auth/callback/steam",
        "openid.mode": "id_res",
        "openid.sig": "fakesig",
        "openid.signed": "op_endpoint,claimed_id,identity,return_to,mode",
      },
      checks: {},
      provider: { callbackUrl: "https://example.com/api/auth/callback/steam" },
    })

    expect(result.tokens.access_token).toBe(FAKE_STEAM_ID)
    expect(result.tokens.token_type).toBe("bearer")
  })

  it("token.request throws when Steam returns is_valid:false", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => `ns:${STEAM_OPENID_NS}\nis_valid:false\n`,
      })
    )

    const provider = Steam({ clientSecret: "test-key" })
    const tokenHandler = provider.token as {
      request: (ctx: any) => Promise<any>
    }

    await expect(
      tokenHandler.request({
        params: {
          "openid.op_endpoint": STEAM_AUTHORIZATION_URL,
          "openid.ns": STEAM_OPENID_NS,
          "openid.claimed_id": FAKE_CLAIMED_ID,
          "openid.identity": FAKE_CLAIMED_ID,
          "openid.mode": "id_res",
        },
        checks: {},
        provider: {
          callbackUrl: "https://example.com/api/auth/callback/steam",
        },
      })
    ).rejects.toThrow(/is_valid:false/)
  })

  it("token.request throws when the endpoint/namespace is wrong", async () => {
    const provider = Steam({ clientSecret: "test-key" })
    const tokenHandler = provider.token as {
      request: (ctx: any) => Promise<any>
    }

    await expect(
      tokenHandler.request({
        params: {
          "openid.op_endpoint": "https://evil.example.com/openid",
          "openid.ns": STEAM_OPENID_NS,
          "openid.claimed_id": FAKE_CLAIMED_ID,
          "openid.identity": FAKE_CLAIMED_ID,
          "openid.mode": "id_res",
        },
        checks: {},
        provider: {
          callbackUrl: "https://example.com/api/auth/callback/steam",
        },
      })
    ).rejects.toThrow(/endpoint or namespace/)
  })

  it("token.request throws when claimed_id does not start with the Steam prefix", async () => {
    const provider = Steam({ clientSecret: "test-key" })
    const tokenHandler = provider.token as {
      request: (ctx: any) => Promise<any>
    }

    await expect(
      tokenHandler.request({
        params: {
          "openid.op_endpoint": STEAM_AUTHORIZATION_URL,
          "openid.ns": STEAM_OPENID_NS,
          "openid.claimed_id": "https://evil.example.com/openid/id/123",
          "openid.identity": FAKE_CLAIMED_ID,
          "openid.mode": "id_res",
        },
        checks: {},
        provider: {
          callbackUrl: "https://example.com/api/auth/callback/steam",
        },
      })
    ).rejects.toThrow(/claimed_id/)
  })

  // ---------------------------------------------------------------------------
  // userinfo.request — Steam Web API call
  // ---------------------------------------------------------------------------

  it("userinfo.request fetches the Steam profile using the Steam ID from access_token", async () => {
    const mockProfile = {
      steamid: FAKE_STEAM_ID,
      personaname: "TestPlayer",
      avatarfull: "https://example.com/avatar_full.jpg",
      avatar: "https://example.com/avatar.jpg",
      avatarmedium: "https://example.com/avatar_medium.jpg",
    }

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ response: { players: [mockProfile] } }),
      })
    )

    const provider = Steam({ clientSecret: "test-key" })
    const userinfoHandler = provider.userinfo as {
      request: (ctx: any) => Promise<any>
    }

    const profile = await userinfoHandler.request({
      tokens: { access_token: FAKE_STEAM_ID },
      provider: { clientSecret: "test-key" },
    })

    expect(profile.steamid).toBe(FAKE_STEAM_ID)
    expect(profile.personaname).toBe("TestPlayer")

    const fetchMock = vi.mocked(fetch)
    const calledUrl = fetchMock.mock.calls[0][0] as URL
    expect(calledUrl.searchParams.get("steamids")).toBe(FAKE_STEAM_ID)
    expect(calledUrl.searchParams.get("key")).toBe("test-key")
  })

  it("userinfo.request throws if access_token (Steam ID) is missing", async () => {
    const provider = Steam({ clientSecret: "test-key" })
    const userinfoHandler = provider.userinfo as {
      request: (ctx: any) => Promise<any>
    }

    await expect(
      userinfoHandler.request({
        tokens: { access_token: undefined },
        provider: { clientSecret: "test-key" },
      })
    ).rejects.toThrow(/access_token.*missing/)
  })

  it("userinfo.request throws if the Steam API returns no players", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ response: { players: [] } }),
      })
    )

    const provider = Steam({ clientSecret: "test-key" })
    const userinfoHandler = provider.userinfo as {
      request: (ctx: any) => Promise<any>
    }

    await expect(
      userinfoHandler.request({
        tokens: { access_token: FAKE_STEAM_ID },
        provider: { clientSecret: "test-key" },
      })
    ).rejects.toThrow(/no player/)
  })
})
