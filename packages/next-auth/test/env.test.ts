import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { NextRequest } from "next/server.js"

import { reqWithEnvURL, setEnvDefaults } from "../lib/env"
import { setEnvDefaults as coreSetEnvDefaults } from "@auth/core"
import type { NextAuthConfig } from "../lib/index.js"

vi.mock("next/server.js", () => ({
  NextRequest: vi.fn(),
}))

vi.mock("@auth/core", () => ({
  setEnvDefaults: vi.fn(),
}))

describe("env", () => {
  beforeEach(() => {
    vi.resetModules()
    vi.resetAllMocks()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  describe("reqWithEnvURL", () => {
    it("should return the original request if AUTH_URL and NEXTAUTH_URL are not set", () => {
      const mockReq = {
        nextUrl: { href: "http://example.com", origin: "http://example.com" },
      }
      const result = reqWithEnvURL(mockReq as NextRequest)

      expect(result).toBe(mockReq)
    })

    it("should return a new request with modified URL if AUTH_URL is set", () => {
      vi.stubEnv("AUTH_URL", "http://auth.example.com")

      const mockReq = {
        nextUrl: {
          href: "http://example.com/path",
          origin: "http://example.com",
        },
      }
      const mockNewReq = {}
      vi.mocked(NextRequest).mockReturnValue(mockNewReq as NextRequest)

      const result = reqWithEnvURL(mockReq as NextRequest)

      expect(NextRequest).toHaveBeenCalledWith(
        "http://auth.example.com/path",
        mockReq
      )
      expect(result).toBe(mockNewReq)
    })
  })

  describe("setEnvDefaults", () => {
    it("should set secret from AUTH_SECRET", () => {
      vi.stubEnv("AUTH_SECRET", "test-secret")

      const config = {} as NextAuthConfig
      setEnvDefaults(config)

      expect(config.secret).toBe("test-secret")
      expect(coreSetEnvDefaults).toHaveBeenCalledWith(process.env, config, true)
    })

    it("should set secret from NEXTAUTH_SECRET if AUTH_SECRET is not set", () => {
      vi.stubEnv("NEXTAUTH_SECRET", "next-auth-secret")

      const config = {} as NextAuthConfig
      setEnvDefaults(config)

      expect(config.secret).toBe("next-auth-secret")
      expect(coreSetEnvDefaults).toHaveBeenCalledWith(process.env, config, true)
    })

    it("should not override existing secret in config", () => {
      vi.stubEnv("AUTH_SECRET", "test-secret")

      const config = { secret: "existing-secret" } as NextAuthConfig
      setEnvDefaults(config)

      expect(config.secret).toBe("existing-secret")
      expect(coreSetEnvDefaults).toHaveBeenCalledWith(process.env, config, true)
    })

    it("should prioritize AUTH_SECRET over NEXTAUTH_SECRET", () => {
      vi.stubEnv("AUTH_SECRET", "auth-secret")
      vi.stubEnv("NEXTAUTH_SECRET", "nextauth-secret")

      const config = {} as NextAuthConfig
      setEnvDefaults(config)

      expect(config.secret).toBe("auth-secret")
    })

    it("should set basePath from AUTH_URL", () => {
      vi.stubEnv("AUTH_URL", "http://example.com/custom-auth")

      const config = {} as NextAuthConfig
      setEnvDefaults(config)

      expect(config.basePath).toBe("/custom-auth")
      expect(coreSetEnvDefaults).toHaveBeenCalledWith(process.env, config, true)
    })

    it("should set basePath from NEXTAUTH_URL if AUTH_URL is not set", () => {
      vi.stubEnv("NEXTAUTH_URL", "http://example.com/next-auth")

      const config = {} as NextAuthConfig
      setEnvDefaults(config)

      expect(config.basePath).toBe("/next-auth")
      expect(coreSetEnvDefaults).toHaveBeenCalledWith(process.env, config, true)
    })

    it('should not set basePath if URL pathname is "/"', () => {
      vi.stubEnv("AUTH_URL", "http://example.com/")

      const config = {} as NextAuthConfig
      setEnvDefaults(config)

      expect(config.basePath).toBe("/api/auth")
      expect(coreSetEnvDefaults).toHaveBeenCalledWith(process.env, config, true)
    })

    it("should not override existing basePath in config", () => {
      vi.stubEnv("AUTH_URL", "http://example.com/custom-auth")

      const config = { basePath: "/existing-path" } as NextAuthConfig
      setEnvDefaults(config)

      expect(config.basePath).toBe("/existing-path")
      expect(coreSetEnvDefaults).toHaveBeenCalledWith(process.env, config, true)
    })

    it("should prioritize AUTH_URL over NEXTAUTH_URL", () => {
      vi.stubEnv("AUTH_URL", "http://example.com/auth-url")
      vi.stubEnv("NEXTAUTH_URL", "http://example.com/nextauth-url")

      const config = {} as NextAuthConfig
      setEnvDefaults(config)

      expect(config.basePath).toBe("/auth-url")
    })

    it("should default basePath to /api/auth if no URL is set", () => {
      const config = {} as NextAuthConfig
      setEnvDefaults(config)

      expect(config.basePath).toBe("/api/auth")
      expect(coreSetEnvDefaults).toHaveBeenCalledWith(process.env, config, true)
    })

    it("should handle invalid URL gracefully", () => {
      vi.stubEnv("AUTH_URL", "invalid-url")

      const config = {} as NextAuthConfig
      setEnvDefaults(config)

      expect(config.basePath).toBe("/api/auth")
      expect(coreSetEnvDefaults).toHaveBeenCalledWith(process.env, config, true)
    })
  })
})
