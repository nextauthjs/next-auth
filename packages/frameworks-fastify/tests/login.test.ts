import { describe, beforeEach, it, expect } from "vitest"
import Fastify, { LightMyRequestResponse } from "fastify"
import formbodyParser from "@fastify/formbody"
import { FastifyAuth, getSession } from "../src/index.js"

import CredentialsProvider from "@auth/core/providers/credentials"
import type { AuthConfig } from "@auth/core"

export const authConfig = {
  secret: "secret",
  providers: [
    CredentialsProvider({
      credentials: { username: { label: "Username" } },
      async authorize(credentials) {
        if (typeof credentials?.username === "string") {
          const { username: name } = credentials
          return { name: name, email: name.replace(" ", "") + "@example.com" }
        }
        return null
      },
    }),
  ],
} satisfies AuthConfig

const extractCookieValue = (
  cookies: LightMyRequestResponse["cookies"],
  name: string
) => {
  const cookie = cookies.find(({ name: _name }) => _name === name)
  return cookie?.value
}

describe("Integration test with login and getSession", () => {
  let fastify: ReturnType<typeof Fastify>

  beforeEach(() => {
    fastify = Fastify()
  })

  it("Should return the session with username after logging in", async () => {
    let expectations: Function = () => {}

    fastify.register(FastifyAuth(authConfig), { prefix: "/api/auth" })

    fastify.post("/test", async (request, reply) => {
      const session = await getSession(request, authConfig)

      expectations = async () => {
        expect(session?.user?.name).toEqual("johnsmith")
        return true
      }

      return "OK"
    })

    await fastify.ready()

    // Get signin page
    const response = await fastify.inject({
      method: "GET",
      url: "/api/auth/signin",
      headers: {
        Accept: "application/json",
      },
    })

    // Parse cookies for csrf token and callback url
    const csrfTokenCookie =
      extractCookieValue(response.cookies, "authjs.csrf-token") ?? ""
    const callbackCookie =
      extractCookieValue(response.cookies, "authjs.callback-url") ?? ""
    const csrfFromCookie = csrfTokenCookie?.split("|")[0] ?? ""

    // Get csrf token. We could just strip the csrf cookie but this tests the csrf endpoint as well.
    const responseCsrf = await fastify.inject({
      method: "GET",
      url: "/api/auth/csrf",
      headers: { Accept: "application/json" },
      cookies: { "authjs.csrf-token": csrfTokenCookie },
    })
    const csrfTokenValue = JSON.parse(responseCsrf.body).csrfToken

    // Check that csrf tokens are the same
    expect(csrfTokenValue).toEqual(csrfFromCookie)

    // Sign in
    const responseCredentials = await fastify.inject({
      method: "POST",
      url: "/api/auth/callback/credentials",
      cookies: {
        "authjs.csrf-token": csrfTokenCookie,
        "authjs.callback-url": callbackCookie,
      },
      payload: {
        csrfToken: csrfTokenValue,
        username: "johnsmith",
        password: "ABC123",
      },
    })

    // Parse cookie for session token
    const sessionTokenCookie =
      extractCookieValue(responseCredentials.cookies, "authjs.session-token") ??
      ""

    // Call test route
    const res = await fastify.inject({
      method: "POST",
      url: "/test",
      headers: {
        Accept: "application/json",
      },
      cookies: {
        "authjs.csrf-token": csrfTokenCookie,
        "authjs.callback-url": callbackCookie,
        "authjs.session-token": sessionTokenCookie,
      },
    })

    expect(res.statusCode).toEqual(200)
    const expectationResult = await expectations()
    expect(expectationResult).toEqual(true)
  })

  it("Should not throw when form body parser already registered", async () => {
    fastify.register(formbodyParser)
    fastify.register(FastifyAuth(authConfig), { prefix: "/api/auth" })
    await fastify.ready()
  })
})
