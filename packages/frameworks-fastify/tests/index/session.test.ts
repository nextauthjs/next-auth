import { jest } from "@jest/globals"

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

jest.unstable_mockModule("@auth/core", () => ({
  Auth: jest.fn((request, config) => {
    return new Response(JSON.stringify(sessionJson), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  }),
}))

// dynamic import to avoid loading Auth before hoisting
const { getSession } = await import("../../src/index.js")

describe("getSession", () => {
  let fastify: ReturnType<typeof Fastify>

  beforeEach(() => {
    fastify = Fastify()
  })

  it("Should return the mocked session from the Auth response", async () => {
    let expectations: Function = () => {}

    fastify.post("/", async (request, reply) => {
      const session = await getSession(request, {
        providers: [],
        secret: "secret",
      })

      expectations = async () => {
        expect(session).toEqual(sessionJson)
      }

      return "OK"
    })

    await fastify.inject({
      method: 'POST',
      url: '/',
      headers: {
        'X-Test-Header': 'foo',
        'Content-Type': 'application/json',
      }
    });

    await expectations()
  })
})
