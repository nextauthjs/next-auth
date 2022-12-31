import { NextMiddleware, NextRequest } from "next/server"
import { NextAuthMiddlewareOptions, withAuth } from "../src/next/middleware"

it("should not match pages as public paths", async () => {
  const options: NextAuthMiddlewareOptions = {
    pages: { signIn: "/", error: "/" },
    secret: "secret",
  }
  const handleMiddleware = withAuth(options) as NextMiddleware

  const response = await handleMiddleware(
    new NextRequest("http://127.0.0.1/protected/pathA"),
    null as any
  )

  expect(response?.status).toBe(307)
  expect(response?.headers.get("location")).toBe(
    "http://localhost/?callbackUrl=%2Fprotected%2FpathA"
  )
})

it("should not redirect on public paths", async () => {
  const options: NextAuthMiddlewareOptions = { secret: "secret" }

  const req = new NextRequest("http://127.0.0.1/_next/foo")

  const handleMiddleware = withAuth(options) as NextMiddleware
  const res = await handleMiddleware(req, null as any)
  expect(res).toBeUndefined()
})

it("should respect NextURL#basePath when redirecting", async () => {
  const options: NextAuthMiddlewareOptions = { secret: "secret" }
  const handleMiddleware = withAuth(options) as NextMiddleware

  const response1 = await handleMiddleware(
    {
      nextUrl: {
        pathname: "/protected/pathA",
        search: "",
        origin: "http://127.0.0.1",
        basePath: "/custom-base-path",
      },
    } as unknown as NextRequest,
    null as any
  )
  expect(response1?.status).toEqual(307)
  expect(response1?.headers.get("location")).toBe(
    "http://127.0.0.1/custom-base-path/api/auth/signin?callbackUrl=%2Fcustom-base-path%2Fprotected%2FpathA"
  )

  // Should not redirect when invoked on sign in page

  const response2 = await handleMiddleware(
    {
      nextUrl: {
        pathname: "/api/auth/signin",
        searchParams: new URLSearchParams({
          callbackUrl: "/custom-base-path/protected/pathA",
        }),
        origin: "http://127.0.0.1",
        basePath: "/custom-base-path",
      },
    } as unknown as NextRequest,
    null as any
  )

  expect(response2).toBeUndefined()
})
