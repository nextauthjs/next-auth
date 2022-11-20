import { MissingAPIRoute } from "../src/core/errors"
import { nodeHandler, streamToJSON } from "./utils"

it("Missing req.url throws MISSING_NEXTAUTH_API_ROUTE_ERROR", async () => {
  const { res, logger } = await nodeHandler()

  expect(res.status).toHaveBeenCalledWith(500)
  expect(logger.error).toBeCalledTimes(1)
  expect(logger.error).toBeCalledWith(
    "MISSING_NEXTAUTH_API_ROUTE_ERROR",
    expect.any(MissingAPIRoute)
  )
  expect(res.setHeader).toBeCalledWith("content-type", "application/json")
  const body = res.send.mock.calls[0][0]
  expect(await streamToJSON(body)).toEqual({
    message:
      "There is a problem with the server configuration. Check the server logs for more information.",
  })
})

it("Missing host throws 400 in production", async () => {
  // @ts-expect-error
  process.env.NODE_ENV = "production"
  const { res } = await nodeHandler()
  expect(res.status).toHaveBeenCalledWith(400)
  // @ts-expect-error
  process.env.NODE_ENV = "test"
})

it("Defined host throws 400 in production if not trusted", async () => {
  // @ts-expect-error
  process.env.NODE_ENV = "production"
  const { res } = await nodeHandler({
    req: { headers: { host: "http://localhost" } },
  })
  expect(res.status).toHaveBeenCalledWith(400)
  // @ts-expect-error
  process.env.NODE_ENV = "test"
})

it("Defined host throws 400 in production if trusted but invalid URL", async () => {
  // @ts-expect-error
  process.env.NODE_ENV = "production"
  const { res } = await nodeHandler({
    req: { headers: { host: "localhost" } },
    options: { trustHost: true },
  })
  expect(res.status).toHaveBeenCalledWith(400)
  // @ts-expect-error
  process.env.NODE_ENV = "test"
})

it("Defined host does not throw in production if trusted and valid URL", async () => {
  // @ts-expect-error
  process.env.NODE_ENV = "production"
  const { res } = await nodeHandler({
    req: {
      url: "/api/auth/session",
      headers: { host: "http://localhost" },
    },
    options: { trustHost: true },
  })
  expect(res.status).toHaveBeenCalledWith(200)
  expect(await streamToJSON(res.send.mock.calls[0][0])).toEqual({})
  // @ts-expect-error
  process.env.NODE_ENV = "test"
})

it("Use process.env.NEXTAUTH_URL for host if present", async () => {
  process.env.NEXTAUTH_URL = "http://localhost"
  const { res } = await nodeHandler({
    req: { url: "/api/auth/session" },
  })
  expect(res.status).toHaveBeenCalledWith(200)
  expect(await streamToJSON(res.send.mock.calls[0][0])).toEqual({})
})
