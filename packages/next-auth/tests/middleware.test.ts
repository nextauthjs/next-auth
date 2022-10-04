import { NextMiddleware } from "next/server"
import { NextAuthMiddlewareOptions, withAuth } from "../src/next/middleware"

it("should not match pages as public paths", async () => {
  const options: NextAuthMiddlewareOptions = {
    pages: {
      signIn: "/",
      error: "/",
    },
    secret: "secret",
  }

  const nextUrl: any = {
    pathname: "/protected/pathA",
    search: "",
    origin: "http://127.0.0.1",
  }
  const req: any = { nextUrl, headers: { authorization: "" } }

  const handleMiddleware = withAuth(options) as NextMiddleware
  const res = await handleMiddleware(req, null as any)
  expect(res).toBeDefined()
  expect(res?.status).toBe(307)
})

it("should not redirect on public paths", async () => {
  const options: NextAuthMiddlewareOptions = {
    secret: "secret",
  }
  const nextUrl: any = {
    pathname: "/_next/foo",
    search: "",
    origin: "http://127.0.0.1",
  }
  const req: any = { nextUrl, headers: { authorization: "" } }

  const handleMiddleware = withAuth(options) as NextMiddleware
  const res = await handleMiddleware(req, null as any)
  expect(res).toBeUndefined()
})

it("should redirect according to nextUrl basePath", async () => {
  const options: NextAuthMiddlewareOptions = {
    secret: "secret"
  }
  const nextUrl: any = {
    pathname: "/protected/pathA",
    search: "",
    origin: "http://127.0.0.1",
    basePath: "/custom-base-path",
  }
  const req: any = { nextUrl, headers: { authorization: "" } }

  const handleMiddleware = withAuth(options) as NextMiddleware
  const res = await handleMiddleware(req, null as any)
  expect(res).toBeDefined()
  expect(res.status).toEqual(307)
  expect(res.headers.get('location')).toContain("http://127.0.0.1/api/auth/signin?callbackUrl=%2Fcustom-base-path%2Fprotected%2FpathA")
})
