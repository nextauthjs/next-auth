import { describe, expect, it } from "vitest"
import ThunderID from "../../src/providers/thunderid"

const baseConfig = {
  clientId: "test-client-id",
  clientSecret: "test-client-secret",
  issuer: "https://thunderid.example.com",
}

describe("ThunderID provider", () => {
  it("returns correct static fields", () => {
    const config = ThunderID(baseConfig)
    expect(config.id).toBe("thunderid")
    expect(config.name).toBe("ThunderID")
    expect(config.type).toBe("oidc")
    expect(config.client).toEqual({
      token_endpoint_auth_method: "client_secret_basic",
    })
    expect(config.style).toEqual({ bg: "#3688FF", text: "#ffffff" })
  })

  it("builds wellKnown URL from issuer", () => {
    const config = ThunderID(baseConfig)
    expect(config.wellKnown).toBe(
      "https://thunderid.example.com/.well-known/openid-configuration"
    )
  })

  it("strips trailing slash from issuer when building wellKnown", () => {
    const config = ThunderID({
      ...baseConfig,
      issuer: "https://thunderid.example.com/",
    })
    expect(config.wellKnown).toBe(
      "https://thunderid.example.com/.well-known/openid-configuration"
    )
  })

  it("passes options through", () => {
    const config = ThunderID(baseConfig)
    expect(config.options).toBe(baseConfig)
  })

  describe("profile()", () => {
    it("maps sub to id", () => {
      const config = ThunderID(baseConfig)
      const result = config.profile!({ sub: "user-123" }, {})
      expect(result.id).toBe("user-123")
    })

    it("uses name when present", () => {
      const config = ThunderID(baseConfig)
      const result = config.profile!({ sub: "u1", name: "Alice Example" }, {})
      expect(result.name).toBe("Alice Example")
    })

    it("falls back to given_name + family_name when name is absent", () => {
      const config = ThunderID(baseConfig)
      const result = config.profile!(
        { sub: "u1", given_name: "Alice", family_name: "Example" },
        {}
      )
      expect(result.name).toBe("Alice Example")
    })

    it("uses only given_name when family_name is absent", () => {
      const config = ThunderID(baseConfig)
      const result = config.profile!({ sub: "u1", given_name: "Alice" }, {})
      expect(result.name).toBe("Alice")
    })

    it("returns null name when no name fields are present", () => {
      const config = ThunderID(baseConfig)
      const result = config.profile!({ sub: "u1" }, {})
      expect(result.name).toBeNull()
    })

    it("maps email when present", () => {
      const config = ThunderID(baseConfig)
      const result = config.profile!(
        { sub: "u1", email: "alice@example.com" },
        {}
      )
      expect(result.email).toBe("alice@example.com")
    })

    it("returns null email when absent", () => {
      const config = ThunderID(baseConfig)
      const result = config.profile!({ sub: "u1" }, {})
      expect(result.email).toBeNull()
    })

    it("maps picture to image when present", () => {
      const config = ThunderID(baseConfig)
      const result = config.profile!(
        { sub: "u1", picture: "https://example.com/avatar.png" },
        {}
      )
      expect(result.image).toBe("https://example.com/avatar.png")
    })

    it("returns null image when picture is absent", () => {
      const config = ThunderID(baseConfig)
      const result = config.profile!({ sub: "u1" }, {})
      expect(result.image).toBeNull()
    })
  })
})
