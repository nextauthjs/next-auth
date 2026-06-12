import { describe, expect, it, vi } from "vitest"

import { customFetch } from "../../src/lib/symbols.js"
import { makeAuthRequest } from "../utils.js"
import type { OAuth2Config } from "../../src/providers/oauth.js"

/**
 * These tests verify that when an OAuth2 provider is configured with a
 * `clientAssertionProvider` (and no `clientSecret`), the token exchange
 * request to the provider's token endpoint is made using
 * RFC 7523 JWT-bearer client assertion parameters instead of a
 * client secret.
 */
describe("OAuth2 clientAssertionProvider", () => {
  function makeFetchMock() {
    const calls: Array<{ url: string; init: RequestInit }> = []
    const fetchMock: typeof fetch = async (input, init) => {
      const url =
        typeof input === "string"
          ? input
          : input instanceof URL
            ? input.toString()
            : input.url
      calls.push({ url, init: init ?? {} })
      // Return an error response so the callback flow short-circuits.
      // We only care about what was sent on the token exchange request.
      return new Response(JSON.stringify({ error: "stopped_by_test" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      })
    }
    return { calls, fetchMock }
  }

  function testProvider(
    overrides: Partial<OAuth2Config<any>> = {}
  ): OAuth2Config<any> {
    return {
      id: "test-oauth",
      name: "Test OAuth",
      type: "oauth",
      clientId: "test-client-id",
      checks: ["none"],
      authorization: "https://auth.example.com/authorize",
      token: "https://auth.example.com/token",
      userinfo: "https://auth.example.com/userinfo",
      ...overrides,
    }
  }

  it("sends client_assertion params (and no client_secret) at the token endpoint", async () => {
    const assertionProvider = vi
      .fn<[], Promise<string>>()
      .mockResolvedValue("fake.jwt.assertion")
    const { calls, fetchMock } = makeFetchMock()

    const provider = testProvider({
      clientAssertionProvider: assertionProvider,
      [customFetch]: fetchMock,
    })

    await makeAuthRequest({
      action: "callback",
      path: "/test-oauth",
      query: { code: "auth-code" },
      config: { providers: [provider] },
    })

    // The assertion provider should be invoked once per token exchange.
    expect(assertionProvider).toHaveBeenCalledTimes(1)

    const tokenCall = calls.find((c) =>
      c.url.startsWith("https://auth.example.com/token")
    )
    expect(tokenCall).toBeDefined()

    const body = new URLSearchParams(String(tokenCall!.init.body))
    expect(body.get("client_id")).toBe("test-client-id")
    expect(body.get("client_assertion_type")).toBe(
      "urn:ietf:params:oauth:client-assertion-type:jwt-bearer"
    )
    expect(body.get("client_assertion")).toBe("fake.jwt.assertion")
    expect(body.get("client_secret")).toBeNull()

    // No HTTP Basic `authorization` header should be present.
    const headers = new Headers(tokenCall!.init.headers as HeadersInit)
    expect(headers.get("authorization")).toBeNull()
  })

  it("falls back to clientSecret (HTTP Basic) when no clientAssertionProvider is configured", async () => {
    const { calls, fetchMock } = makeFetchMock()

    const provider = testProvider({
      clientSecret: "super-secret",
      [customFetch]: fetchMock,
    })

    await makeAuthRequest({
      action: "callback",
      path: "/test-oauth",
      query: { code: "auth-code" },
      config: { providers: [provider] },
    })

    const tokenCall = calls.find((c) =>
      c.url.startsWith("https://auth.example.com/token")
    )
    expect(tokenCall).toBeDefined()

    const headers = new Headers(tokenCall!.init.headers as HeadersInit)
    expect(headers.get("authorization")).toMatch(/^Basic /)

    const body = new URLSearchParams(String(tokenCall!.init.body))
    expect(body.get("client_assertion")).toBeNull()
    expect(body.get("client_assertion_type")).toBeNull()
  })

  it("prefers clientSecret over clientAssertionProvider when both are set", async () => {
    const assertionProvider = vi
      .fn<[], Promise<string>>()
      .mockResolvedValue("fake.jwt.assertion")
    const { calls, fetchMock } = makeFetchMock()

    const provider = testProvider({
      clientSecret: "super-secret",
      clientAssertionProvider: assertionProvider,
      [customFetch]: fetchMock,
    })

    await makeAuthRequest({
      action: "callback",
      path: "/test-oauth",
      query: { code: "auth-code" },
      config: { providers: [provider] },
    })

    expect(assertionProvider).not.toHaveBeenCalled()

    const tokenCall = calls.find((c) =>
      c.url.startsWith("https://auth.example.com/token")
    )
    expect(tokenCall).toBeDefined()

    const body = new URLSearchParams(String(tokenCall!.init.body))
    expect(body.get("client_assertion")).toBeNull()
    expect(body.get("client_assertion_type")).toBeNull()

    const headers = new Headers(tokenCall!.init.headers as HeadersInit)
    expect(headers.get("authorization")).toMatch(/^Basic /)
  })
})
