import { describe, it, expect, vi, beforeEach, afterEach } from "vitest"
import { Auth, skipCSRFCheck } from "@auth/core"
import { encode } from "@auth/core/jwt"
import NextAuth, { type NextAuthConfig } from "../src"

// Regression test for https://github.com/nextauthjs/next-auth/issues/12909
//
// `handleAuth()` (the `export { auth as middleware }` wrapper) runs on every
// middleware-matched request, including the POST to `/api/auth/signout`
// itself. For a JWT session it unconditionally called `getSession()`, which
// re-signs and re-sets the session cookie with a fresh expiry as a side
// effect of merely reading it, and then appended that cookie onto whatever
// the real `/api/auth/signout` route handler produced. The final response
// ended up carrying two conflicting `Set-Cookie` headers for the same
// cookie name: a freshly-signed live session cookie and a `Max-Age=0` clear
// cookie. Per RFC 6265 4.1.1 this is undefined behavior, and depending on
// the hosting runtime's header order, sign-out could silently fail to
// actually clear the session.

const SESSION_COOKIE_NAME = "authjs.session-token"
const SECRET = "test-secret-value-thats-long-enough"
const BASE_URL = "http://localhost/api/auth"

let mockedHeaders = vi.hoisted(() => new globalThis.Headers())

vi.mock("next/headers", async (importOriginal) => {
  const originalModule = await importOriginal<typeof import("next/headers")>()
  return {
    ...originalModule,
    headers: () => mockedHeaders,
  }
})

const config: NextAuthConfig = {
  providers: [],
}

async function sessionCookieHeader() {
  const token = await encode({
    secret: SECRET,
    salt: SESSION_COOKIE_NAME,
    token: { sub: "user-1", name: "Jane Doe", email: "jane@example.com" },
  })
  return `${SESSION_COOKIE_NAME}=${token}`
}

function sessionSetCookies(res: Response) {
  return res.headers
    .getSetCookie()
    .filter((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`))
}

describe("handleAuth and the session cookie on sign-out (#12909)", () => {
  beforeEach(() => {
    mockedHeaders = new globalThis.Headers()
    process.env.AUTH_SECRET = SECRET
    process.env.AUTH_URL = BASE_URL
  })

  afterEach(() => {
    vi.clearAllMocks()
    delete process.env.AUTH_SECRET
    delete process.env.AUTH_URL
  })

  it("does not append its own session-refresh cookie for a POST to /api/auth/signout", async () => {
    const { auth } = NextAuth(config)
    const cookie = await sessionCookieHeader()

    const req: any = new Request(`${BASE_URL}/signout`, {
      method: "POST",
      headers: { cookie },
    })
    req.nextUrl = new URL(`${BASE_URL}/signout`)

    const res: Response = await auth(req, {} as any)

    // Before the fix, handleAuth's own getSession() call re-signed and
    // appended a live session cookie here. handleAuth must not append
    // anything for its own action routes -- the real signout route handler
    // (invoked separately by Next.js) is solely responsible for the
    // session cookie on this request.
    expect(sessionSetCookies(res)).toHaveLength(0)
  })

  it("still refreshes the session cookie exactly once for an ordinary page request", async () => {
    const { auth } = NextAuth(config)
    const cookie = await sessionCookieHeader()

    const req: any = new Request("http://localhost/dashboard", {
      headers: { cookie },
    })
    req.nextUrl = new URL("http://localhost/dashboard")

    const res: Response = await auth(req, {} as any)

    // Normal, non-action page requests must be unaffected by the fix: the
    // session cookie should still be refreshed, exactly once, with a live
    // (non-expiring-now) value.
    const cookies = sessionSetCookies(res)
    expect(cookies).toHaveLength(1)
    expect(cookies[0]).not.toContain("Max-Age=0")
  })

  it("merged with the real signout route's response, yields exactly one Set-Cookie for the session, and it's the clearing one", async () => {
    const { auth } = NextAuth(config)
    const cookie = await sessionCookieHeader()

    // 1. The middleware pass (`handleAuth`), exactly as Next.js invokes it
    // before routing the request onward.
    const middlewareReq: any = new Request(`${BASE_URL}/signout`, {
      method: "POST",
      headers: {
        cookie,
        "content-type": "application/x-www-form-urlencoded",
      },
    })
    middlewareReq.nextUrl = new URL(`${BASE_URL}/signout`)
    const middlewareResponse: Response = await auth(middlewareReq, {} as any)

    // 2. The actual signout route handler, invoked completely separately
    // by Next.js's router once the middleware lets the request through.
    const routeReq = new Request(`${BASE_URL}/signout`, {
      method: "POST",
      headers: {
        cookie,
        "content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ callbackUrl: "/" }),
    })
    const routeResponse = await Auth(routeReq, { ...config, skipCSRFCheck })

    // 3. Simulate how Next.js merges the middleware's forwarded response
    // headers with the headers produced by the matched route.
    const merged = new Headers(middlewareResponse.headers)
    for (const c of routeResponse.headers.getSetCookie())
      merged.append("set-cookie", c)

    const setCookies = merged
      .getSetCookie()
      .filter((c) => c.startsWith(`${SESSION_COOKIE_NAME}=`))

    expect(setCookies).toHaveLength(1)
    expect(setCookies[0]).toContain("Max-Age=0")
  })
})
