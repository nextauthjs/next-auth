import { describe, beforeEach, it, expect } from "vitest"
import supertest from "supertest"
import express from "express"
import { ExpressAuth, getSession } from "../src/index.js"

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

const extractCookieValue = (cookieHeader: string | string[], name: string) => {
  const cookieStringFull = Array.isArray(cookieHeader)
    ? cookieHeader.find((header) => header.includes(name))
    : cookieHeader
  return name + cookieStringFull?.split(name)[1].split(";")[0]
}

describe("Integration test with login and getSession", () => {
  let app: express.Express
  let client: ReturnType<typeof supertest>

  beforeEach(() => {
    app = express()
    client = supertest(app)
  })

  it("Should return the session with username after logging in", async () => {
    let expectations = () => {}

    app.use("/auth/*", ExpressAuth(authConfig))

    app.post("/test", async (req, res) => {
      const session = await getSession(req, authConfig)

      expectations = async () => {
        expect(session?.user?.name).toEqual("johnsmith")
      }

      res.send("OK")
    })

    // Get signin page
    const response = await client
      .get("/auth/signin")
      .set("X-Test-Header", "foo")
      .set("Accept", "application/json")

    // Parse cookies for csrf token and callback url
    const csrfTokenCookie = extractCookieValue(
      response.headers["set-cookie"],
      "authjs.csrf-token"
    )
    const callbackCookie = extractCookieValue(
      response.headers["set-cookie"],
      "authjs.callback-url"
    )
    const csrfTokenValue = csrfTokenCookie.split("%")[0].split("=")[1]

    // Sign in
    const responseCredentials = await client
      .post("/auth/callback/credentials")
      .set("Cookie", [csrfTokenCookie, callbackCookie]) // Send the cookie with the request
      .send({ csrfToken: csrfTokenValue, username: "johnsmith" })

    // Parse cookie for session token
    const sessionTokenCookie = extractCookieValue(
      responseCredentials.headers["set-cookie"],
      "authjs.session-token"
    )

    // Call test route
    await client
      .post("/test")
      .set("X-Test-Header", "foo")
      .set("Accept", "application/json")
      .set("Cookie", [sessionTokenCookie])

    await expectations()
  })
})
