import { mockLogger } from "./lib"
import * as checks from "../src/core/lib/oauth/checks"
import type { Cookie } from "../src/core/lib/cookie"
import type { AuthorizationParameters } from "openid-client"

// The edge-runtime test environment cannot decrypt jose JWEs, so the sealed
// payload is carried through a transparent codec to exercise the real provider
// binding logic in `create`/`use`.
jest.mock("../src/jwt", () => ({
  encode: jest.fn(async ({ token }: any) => JSON.stringify(token)),
  decode: jest.fn(async ({ token }: any) => JSON.parse(token)),
}))

type Check = "pkce" | "state" | "nonce"

function optionsFor(id: string, providerChecks: Check[]) {
  return {
    logger: mockLogger(),
    provider: { id, checks: providerChecks },
    jwt: { secret: "secret" },
    cookies: {
      pkceCodeVerifier: { name: "next-auth.pkce.code_verifier", options: {} },
      state: { name: "next-auth.state", options: {} },
      nonce: { name: "next-auth.nonce", options: {} },
    },
  } as any
}

const cases = [
  {
    check: "state" as const,
    cookie: "state" as const,
    resultKey: "state" as const,
  },
  {
    check: "nonce" as const,
    cookie: "nonce" as const,
    resultKey: "nonce" as const,
  },
  {
    check: "pkce" as const,
    cookie: "pkceCodeVerifier" as const,
    resultKey: "code_verifier" as const,
  },
]

describe("OAuth check cookies are bound to their provider", () => {
  for (const { check, cookie, resultKey } of cases) {
    describe(check, () => {
      it("accepts a cookie on the same provider's callback", async () => {
        const options = optionsFor("github", [check])
        const created: Cookie[] = []
        const params: AuthorizationParameters = {}
        await checks[check].create(options, created, params)

        const reqCookies = { [options.cookies[cookie].name]: created[0].value }
        const result: any = {}
        await checks[check].use(reqCookies, [], options, result)

        expect(result[resultKey]).toBeDefined()
      })

      it("rejects a cookie minted for a different provider", async () => {
        const github = optionsFor("github", [check])
        const created: Cookie[] = []
        const params: AuthorizationParameters = {}
        await checks[check].create(github, created, params)

        const google = optionsFor("google", [check])
        const reqCookies = { [google.cookies[cookie].name]: created[0].value }
        await expect(
          checks[check].use(reqCookies, [], google, {} as any)
        ).rejects.toThrow(/created for a different provider/)
      })

      it("rejects a legacy cookie with no provider field", async () => {
        const options = optionsFor("github", [check])
        const legacy = JSON.stringify({ value: "legacy" })
        const reqCookies = { [options.cookies[cookie].name]: legacy }
        await expect(
          checks[check].use(reqCookies, [], options, {} as any)
        ).rejects.toThrow(/created for a different provider/)
      })
    })
  }
})
