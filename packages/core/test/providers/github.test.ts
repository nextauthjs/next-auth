import { afterEach, describe, expect, it, vi } from "vitest"
import GitHub from "../../src/providers/github"
import type { GitHubEmail } from "../../src/providers/github"

const tokens = { access_token: "test-access-token" }

// Minimal /user payload: the provider only reads `email` off it here.
const baseProfile = {
  id: 1,
  login: "some-bot",
  email: null,
}

function stubFetch(routes: Record<string, unknown>) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async (input: string | URL | Request) => {
      const url = input.toString()
      if (!(url in routes)) throw new Error(`unexpected fetch to ${url}`)
      return { ok: true, json: async () => routes[url] }
    })
  )
}

async function runUserinfoRequest(emailsResponse: unknown) {
  stubFetch({
    "https://api.github.com/user": { ...baseProfile },
    "https://api.github.com/user/emails": emailsResponse,
  })
  const provider = GitHub({ clientId: "id", clientSecret: "secret" })
  const request = provider.userinfo?.request
  if (!request) throw new Error("GitHub provider has no userinfo.request")
  return request({ tokens, provider } as any)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("GitHub provider userinfo", () => {
  it("does not throw when /user/emails returns an empty array", async () => {
    // Bot / service / org-restricted accounts get 200 with [] here.
    // See https://github.com/nextauthjs/next-auth/issues/13495
    const profile = await runUserinfoRequest([])
    expect(profile.email).toBeNull()
  })

  it("uses the primary email when one is present", async () => {
    const emails: GitHubEmail[] = [
      {
        email: "secondary@example.com",
        primary: false,
        verified: true,
        visibility: "private",
      },
      {
        email: "primary@example.com",
        primary: true,
        verified: true,
        visibility: "public",
      },
    ]
    const profile = await runUserinfoRequest(emails)
    expect(profile.email).toBe("primary@example.com")
  })

  it("falls back to the first email when none is marked primary", async () => {
    const emails: GitHubEmail[] = [
      {
        email: "first@example.com",
        primary: false,
        verified: true,
        visibility: "private",
      },
    ]
    const profile = await runUserinfoRequest(emails)
    expect(profile.email).toBe("first@example.com")
  })

  it("does not call /user/emails when the profile already has an email", async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ ...baseProfile, email: "public@example.com" }),
    }))
    vi.stubGlobal("fetch", fetchMock)
    const provider = GitHub({ clientId: "id", clientSecret: "secret" })
    const profile = await provider.userinfo!.request!({
      tokens,
      provider,
    } as any)
    expect(profile.email).toBe("public@example.com")
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })
})
