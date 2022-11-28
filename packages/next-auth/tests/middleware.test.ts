import { NextMiddleware, NextRequest } from "next/server"
import { NextAuthMiddlewareOptions, withAuth } from "../src/next/middleware"

it("should not match pages as public paths", async () => {
  const options: NextAuthMiddlewareOptions = {
    pages: { signIn: "/", error: "/" },
    secret: "secret",
  }

  const req = new NextRequest("http://127.0.0.1/protected/pathA", {
    headers: { authorization: "" },
  })

  const handleMiddleware = withAuth(options) as NextMiddleware
  const res = await handleMiddleware(req, null as any)
  expect(res).toBeDefined()
  expect(res?.status).toBe(307)
})

it("should not redirect on public paths", async () => {
  const options: NextAuthMiddlewareOptions = { secret: "secret" }

  const req = new NextRequest("http://127.0.0.1/_next/foo", {
    headers: { authorization: "" },
  })

  const handleMiddleware = withAuth(options) as NextMiddleware
  const res = await handleMiddleware(req, null as any)
  expect(res).toBeUndefined()
})

it("should redirect according to nextUrl basePath", async () => {
  const options: NextAuthMiddlewareOptions = { secret: "secret" }

  const req = {
    nextUrl: {
      pathname: "/protected/pathA",
      search: "",
      origin: "http://127.0.0.1",
      basePath: "/custom-base-path",
    },
    headers: new Headers({ authorization: "" }),
  }

  const handleMiddleware = withAuth(options) as NextMiddleware
  const res = await handleMiddleware(req as NextRequest, null as any)
  expect(res).toBeDefined()
  expect(res?.status).toEqual(307)
  expect(res?.headers.get("location")).toContain(
    "http://127.0.0.1/custom-base-path/api/auth/signin?callbackUrl=%2Fcustom-base-path%2Fprotected%2FpathA"
  )
})

it("should redirect according to nextUrl basePath", async () => {
  // given
  const options: NextAuthMiddlewareOptions = { secret: "secret" }

  const handleMiddleware = withAuth(options) as NextMiddleware

  const req1 = {
    nextUrl: {
      pathname: "/protected/pathA",
      search: "",
      origin: "http://127.0.0.1",
      basePath: "/custom-base-path",
    },
    headers: new Headers({ authorization: "" }),
  }
  // when
  const res = await handleMiddleware(req1 as NextRequest, null as any)

  // then
  expect(res).toBeDefined()
  expect(res?.status).toEqual(307)
  expect(res?.headers.get("location")).toContain(
    "http://127.0.0.1/custom-base-path/api/auth/signin?callbackUrl=%2Fcustom-base-path%2Fprotected%2FpathA"
  )

  const req2 = {
    nextUrl: {
      pathname: "/api/auth/signin",
      search: "callbackUrl=%2Fcustom-base-path%2Fprotected%2FpathA",
      origin: "http://127.0.0.1",
      basePath: "/custom-base-path",
    },
    headers: new Headers({ authorization: "" }),
  }
  // and when follow redirect
  const resFromRedirectedUrl = await handleMiddleware(
    req2 as NextRequest,
    null as any
  )

  // then return sign in page
  expect(resFromRedirectedUrl).toBeUndefined()
})
