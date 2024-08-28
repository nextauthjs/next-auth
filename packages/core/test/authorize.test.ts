import { describe, expect, it, vi, beforeEach } from "vitest"
import { Auth, AuthConfig, skipCSRFCheck } from "../src"
import { Adapter } from "../src/adapters"
import SendGrid from "../src/providers/sendgrid"
import { getUserAndAccount } from "../src/lib/actions/callback/oauth/callback"
import { getUserAndAccountArgs } from "./fixtures/oauth-callback.ts"

const mockAdapter: Adapter = {
  createVerificationToken: vi.fn(),
  useVerificationToken: vi.fn(),
  getUserByEmail: vi.fn(),
}
const logger = { error: vi.fn() }

async function signIn(config: Partial<AuthConfig> = {}) {
  return (await Auth(
    new Request("http://a/auth/signin/sendgrid", {
      method: "POST",
      body: new URLSearchParams({ email: "a@b.c" }),
    }),
    {
      secret: "secret",
      trustHost: true,
      logger,
      adapter: mockAdapter,
      skipCSRFCheck,
      providers: [SendGrid],
      ...config,
    }
  )) as Response
}

describe("auth via callbacks.signIn", () => {
  beforeEach(() => {
    logger.error.mockReset()
  })
  describe("redirect before sending an email", () => {
    it("return false", async () => {
      const res = await signIn({ callbacks: { signIn: () => false } })
      expect(res.headers.get("Location")).toBe(
        "http://a/auth/error?error=AccessDenied"
      )
    })
    it("return redirect relative URL", async () => {
      const res = await signIn({ callbacks: { signIn: () => "/wrong" } })
      expect(res.headers.get("Location")).toBe("http://a/wrong")
    })

    it("return redirect absolute URL, different domain", async () => {
      const res = await signIn({ callbacks: { signIn: () => "/wrong" } })
      const redirect = res.headers.get("Location")
      // Not allowed by our default redirect callback
      expect(redirect).not.toBe("http://b/wrong")
      expect(redirect).toBe("http://a/wrong")
    })

    it("throw error", async () => {
      const e = new Error("my error")
      const res = await signIn({
        callbacks: {
          signIn() {
            throw e
          },
        },
      })
      expect(res.headers.get("Location")).toBe(
        "http://a/auth/error?error=AccessDenied"
      )
    })
  })

  describe("oauth callback", () => {
    it("should build the correct user object", async () => {
      const { profile, provider, tokens, logger } = getUserAndAccountArgs
      const profileResult = await getUserAndAccount(
        profile,
        provider,
        tokens,
        logger
      )

      expect(profileResult?.account.type).toBe("oauth")
      expect(profileResult?.account.provider).toBe("github")
      expect(profileResult?.account.providerAccountId).toBe("abc")
      expect(profileResult?.user.email).toBe("fill@murray.com")

      // Test 'user.id' is a valid UUIDv4 from `crypto.randomUUID()`
      expect(
        profileResult?.user.id.match(
          /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
        )?.[0]
      ).toBe(profileResult?.user.id)
    })
  })

  // TODO: We need an OAuth provider to test against
  describe.todo("redirect in oauth", () => {})
})
