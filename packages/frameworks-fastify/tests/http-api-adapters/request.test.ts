import Fastify from "fastify"
import type { FastifyRequest } from 'fastify';
import { encodeUrlEncoded, toWebRequest } from "../../src/lib"

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
  expect(typeof req.body).toEqual("object");
  expect(req.body).not.toBeNull();
  if (typeof req.body === 'object' && req.body !== null) {
    expect(body).toEqual(encodeUrlEncoded(req.body))
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

  it("adapts request with json encoded body", async () => {
    let expectations: Function = () => {}

    fastify.post("/", async (req, reply) => {
      const request = toWebRequest(req)

      expectations = async () => {
        expectMatchingJsonRequestBody(req, request)
      }

      return "OK"
    })

    const data = {
      name: "Rexford",
    }

    await fastify.inject({
      method: 'POST',
      url: '/',
      headers: {
        'Content-Type': 'application/json',
      },
      payload: data,
    });

    await expectations()
  })

  it("adapts request with url-encoded body", async () => {
    let expectations: Function = () => {}


    fastify.post("/", async (req, reply) => {
      const request = toWebRequest(req)

      expectations = async () => {
        expectMatchingUrlEncodedRequestBody(req, request)
      }

      return "OK"
    })

    const data = {
      name: "Rexford",
      nums: [1, 2, 3],
    }
    
    await fastify.inject({
      method: 'POST',
      url: '/',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      payload: encodeUrlEncoded(data),
    });

    await expectations()
  })
})
