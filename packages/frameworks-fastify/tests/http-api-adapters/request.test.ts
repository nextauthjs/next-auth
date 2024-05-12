import { describe, beforeEach, it, expect } from "vitest"
import Fastify from "fastify"
import type { FastifyRequest } from "fastify"
import { encodeUrlEncoded, toWebRequest } from "../../src/lib"
import formbodyParser from "@fastify/formbody"

function expectMatchingRequestHeaders(req: FastifyRequest, request: Request) {
  for (let headerName in req.headers) {
    expect(request.headers.get(headerName)).toEqual(req.headers[headerName])
  }
}

async function expectMatchingJsonRequestBody(
  req: FastifyRequest,
  request: Request
) {
  const body = await request.json()
  expect(body).toEqual(req.body)
}

async function expectMatchingUrlEncodedRequestBody(
  req: FastifyRequest,
  request: Request
) {
  const body = await request.text()
  expect(typeof req.body).toEqual("object")
  expect(req.body).not.toBeNull()
  if (typeof req.body === "object" && req.body !== null) {
    expect(body).toEqual(encodeUrlEncoded(req.body))
  } else {
    throw new Error("req.body is not an object or is null")
  }
}

describe("toWebRequest", () => {
  let fastify: ReturnType<typeof Fastify>

  beforeEach(() => {
    fastify = Fastify()
  })

  it("adapts request headers", async () => {
    let expectations: Function = () => {}

    fastify.post("/", async (req, reply) => {
      const request = toWebRequest(req)

      expectations = async () => {
        expectMatchingRequestHeaders(req, request)
        return true
      }

      return "OK"
    })

    await fastify.ready()

    const res = await fastify.inject({
      method: "POST",
      url: "/",
      headers: {
        "X-Test-Header": "foo",
        "Content-Type": "application/json",
      },
      payload: {},
    })

    expect(res.statusCode).toEqual(200)

    const expectationResult = await expectations()
    expect(expectationResult).toEqual(true)
  })

  it("adapts request with json encoded body", async () => {
    let expectations: Function = () => {}

    fastify.post("/", async (req, reply) => {
      const request = toWebRequest(req)

      expectations = async () => {
        await expectMatchingJsonRequestBody(req, request)
        return true
      }

      return "OK"
    })

    await fastify.ready()

    const data = {
      name: "Rexford",
    }

    await fastify.inject({
      method: "POST",
      url: "/",
      headers: {
        "Content-Type": "application/json",
      },
      payload: data,
    })

    const expectationResult = await expectations()
    expect(expectationResult).toEqual(true)
  })

  it("adapts request with url-encoded body", async () => {
    let expectations: Function = () => {}

    fastify.register(formbodyParser)
    fastify.post("/", async (req, reply) => {
      const request = toWebRequest(req)

      expectations = async () => {
        await expectMatchingUrlEncodedRequestBody(req, request)
        return true
      }

      return "OK"
    })

    await fastify.ready()

    const data = {
      name: "Rexford",
      nums: [1, 2, 3],
    }

    const res = await fastify.inject({
      method: "POST",
      url: "/",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      payload: encodeUrlEncoded(data),
    })

    expect(res.statusCode).toEqual(200)

    const expectationResult = await expectations()
    expect(expectationResult).toEqual(true)
  })
})
