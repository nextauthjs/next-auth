import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import NextAuth, { type NextAuthConfig } from "../src"

// A provider with neither `issuer` nor an `authorization` endpoint makes
// `@auth/core` bail out of every request with a `500 { message }` response.
// See GHSA-8fpg-xm3f-6cx3.
const brokenConfig: NextAuthConfig = {
  providers: [
    {
      id: "broken",
      name: "Broken",
      type: "oidc",
      clientId: "client-id",
      clientSecret: "client-secret",
    },
  ],
}

let mockedHeaders = vi.hoisted(() => new globalThis.Headers())

vi.mock("next/headers", async (importOriginal) => {
  const originalModule = await importOriginal<typeof import("next/headers")>()
  return {
    ...originalModule,
    headers: () => mockedHeaders,
  }
})

describe("auth checks fail closed on provider configuration errors", () => {
  beforeEach(() => {
    mockedHeaders = new globalThis.Headers()
    process.env.AUTH_SECRET = "secret"
    process.env.AUTH_URL = "https://app.example.com/api/auth"
  })

  afterEach(() => {
    vi.clearAllMocks()
    delete process.env.AUTH_SECRET
    delete process.env.AUTH_URL
  })

  it("returns null instead of an error object from the RSC `auth()` call", async () => {
    const { auth } = NextAuth(brokenConfig)

    const session = await auth()

    // Before the fix, the 500 error body `{ message: "..." }` was returned
    // verbatim, making `!!auth` truthy for everyone (fail open).
    expect(session).toBeNull()
  })

  it("sets `req.auth` to null in the middleware wrapper", async () => {
    const { auth } = NextAuth(brokenConfig)

    let observed: unknown = "unset"
    const handler = auth((req) => {
      observed = req.auth
    })

    const req: any = new Request("https://app.example.com/dashboard")
    req.nextUrl = new URL("https://app.example.com/dashboard")
    await handler(req, {} as any)

    expect(observed).toBeNull()
  })
})
