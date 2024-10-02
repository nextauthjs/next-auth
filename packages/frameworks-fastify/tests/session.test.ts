import { vi, describe, beforeEach, it, expect } from "vitest"

import Fastify from "fastify"

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
  let fastify: ReturnType<typeof Fastify>

  beforeEach(() => {
    fastify = Fastify()
  })

  it("Should return the mocked session from the Auth response", async () => {
    let expectations: Function = () => {}

    fastify.get("/", async (request, reply) => {
      const session = await getSession(request, {
        providers: [],
        secret: "secret",
      })

      expectations = async () => {
        expect(session).toEqual(sessionJson)
        return true
      }

      return "OK"
    })

    await fastify.ready()

    const res = await fastify.inject({
      method: "GET",
      url: "/",
    })

    expect(res.statusCode).toEqual(200)
    const expectationResult = await expectations()
    expect(expectationResult).toEqual(true)
  })
})
