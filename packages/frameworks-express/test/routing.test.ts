import { describe, beforeEach, it, expect, vi } from "vitest"
import supertest from "supertest"
import express from "express"
import { ExpressAuth } from "../src/index.js"

import CredentialsProvider from "@auth/core/providers/credentials"
import type { AuthConfig } from "@auth/core"

// mock the toWebRequest, make it throw if "X-Test-Header" = 'throw'
vi.mock("../src/lib/index.js", async (importOriginal) => {
  const mod = await importOriginal<typeof import("../src/lib/index.js")>()
  return {
    ...mod,
    toWebRequest: vi.fn((req) => {
      if (req.headers["x-test-header"] === "throw") {
        throw new Error("Test error")
      }
      return mod.toWebRequest(req)
    }),
  }
})

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

describe("Middleware behaviour", () => {
  let app: express.Express
  let client: ReturnType<typeof supertest>
  let error: Error | null

  beforeEach(() => {
    app = express()
    client = supertest(app)

    error = null

    app.use("/auth/*", ExpressAuth(authConfig))
    app.get("/*", (req, res, next) => {
      try {
        res.send("Hello World")
      } catch (err) {
        error = err
      }
    })
    app.use((err, req, res, next) => {
      error = err
      res.status(500).send("Something broke!")
    })
  })

  it("Should sent response only once", async () => {
    const response = await client
      .get("/auth/session")
      .set("Accept", "application/json")

    expect(response.status).toBe(200)
    expect(error).toBe(null)
  })

  it("Should send status 500 if there is an error thrown in the auth middleware", async () => {
    // send header that causes mock to throw
    const response = await client
      .get("/auth/session")
      .set("Accept", "application/json")
      .set("X-Test-Header", "throw")

    expect(response.status).toBe(500)
  })
})
