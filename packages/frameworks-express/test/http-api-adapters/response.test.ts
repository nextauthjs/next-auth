import { describe, beforeEach, it, expect } from "vitest"
import supertest from "supertest"
import express from "express"
import { toExpressResponse } from "../../src/lib"

function expectMatchingResponseHeaders(
  response: Response,
  res: supertest.Response
) {
  for (let [headerName] of response.headers) {
    expect(response.headers.get(headerName)).toEqual(
      res.headers[headerName.toLowerCase()]
    )
  }
}

describe("toWebResponse", () => {
  let app: express.Express
  let client: ReturnType<typeof supertest>

  beforeEach(() => {
    app = express()
    client = supertest(app)
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
