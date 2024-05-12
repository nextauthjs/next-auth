import { describe, beforeEach, it, expect } from "vitest"
import Fastify from "fastify"
import type { LightMyRequestResponse } from "fastify"
import { toFastifyReply } from "../../src/lib"

function expectMatchingResponseHeaders(
  response: Response,
  res: LightMyRequestResponse
) {
  for (let [headerName] of response.headers) {
    const resValue = res.headers[headerName.toLowerCase()] as string
    expect(response.headers.get(headerName)).toEqual(
      resValue.split("; charset=utf-8")[0]
    )
  }
}

describe("toWebResponse", () => {
  let fastify: ReturnType<typeof Fastify>

  beforeEach(() => {
    fastify = Fastify()
  })

  it("adapts response", async () => {
    let webResponse: Response = new Response()

    fastify.post("/", async (req, reply) => {
      const headers = new Headers()
      headers.append("X-Test-Header", "foo")
      headers.append("Content-Type", "application/json")

      webResponse = new Response(JSON.stringify({ name: "Rexford" }), {
        headers: headers,
        status: 200,
      })
      return toFastifyReply(webResponse, reply)
    })

    await fastify.ready()

    const res = await fastify.inject({
      method: "POST",
      url: "/",
    })

    expect(res.statusCode).toEqual(200)
    expectMatchingResponseHeaders(webResponse, res)
    expect(res.body).toEqual(JSON.stringify({ name: "Rexford" }))
  })
})
