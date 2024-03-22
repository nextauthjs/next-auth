import { vi, describe, it, beforeEach, expect } from "vitest"
import supertest from "supertest"
import express from "express"

const sessionJson = {
  user: {
    name: "John Doe",
    email: "test@example.com",
    image: "",
    id: "1234",
  },
  expires: "",
}

vi.mock("@auth/core", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@auth/core")>()
  return {
    ...mod,
    Auth: vi.fn((request, config) => {
      return new Response(JSON.stringify(sessionJson), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    }),
  }
})

// dynamic import to avoid loading Auth before hoisting
const { getSession } = await import("../src/index.js")

describe("getSession", () => {
  let app: express.Express
  let client: ReturnType<typeof supertest>

  beforeEach(() => {
    app = express()
    client = supertest(app)
  })

  it("Should return the mocked session from the Auth response", async () => {
    let expectations: Function = () => {}

    app.post("/", async (req, res) => {
      const session = await getSession(req, {
        providers: [],
        secret: "secret",
      })

      expectations = async () => {
        expect(session).toEqual(sessionJson)
      }

      res.send("OK")
    })

    await client
      .post("/")
      .set("X-Test-Header", "foo")
      .set("Accept", "application/json")

    await expectations()
  })
})
