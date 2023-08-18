import * as express from "express"
import {
  encodeUrlEncoded,
  toExpressResponse,
  toWebRequest,
} from "../../src/http-api-adapters"
import * as request from "supertest"
import { Response as ExpressResponse } from "express"

if (!globalThis.fetch) {
  console.log("polyfill fetch")
  globalThis.fetch = require("node-fetch")
  globalThis.Request = require("node-fetch").Request
  globalThis.Response = require("node-fetch").Response
  globalThis.Headers = require("node-fetch").Headers
}

function expectMatchingResponseHeaders(
  response: Response,
  res: request.Response
) {
  for (let [headerName] of response.headers) {
    expect(response.headers.get(headerName)).toEqual(
      res.headers[headerName.toLowerCase()]
    )
  }
}

describe("toWebResponse", () => {
  let app: express.Express
  let client: ReturnType<typeof request>

  beforeEach(() => {
    app = express()
    client = request(app)
  })

  it("adapts response", async () => {
    let webResponse: Response = new Response()

    app.post("/", async (req, res) => {
      const headers = new Headers()
      headers.append("X-Test-Header", "foo")
      headers.append("Content-Type", "application/json")

      webResponse = new Response(JSON.stringify({ name: "Rexford" }), {
        headers: headers,
        status: 200,
      })
      toExpressResponse(webResponse, res)
    })

    const res = await client.post("/")

    expectMatchingResponseHeaders(webResponse, res)
    expect(res.body).toEqual({ name: "Rexford" })
  })
})
