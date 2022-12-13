import { mockReqRes, nextHandler } from "./utils"

it("Missing req.url throws in dev", async () => {
  await expect(nextHandler).rejects.toThrow(new Error("Missing url"))
})

const configErrorMessage =
  "There is a problem with the server configuration. Check the server logs for more information."

it("Missing req.url returns config error in prod", async () => {
  // @ts-expect-error
  process.env.NODE_ENV = "production"
  const { res, logger } = await nextHandler()

  expect(logger.error).toBeCalledTimes(1)
  const error = new Error("Missing url")
  expect(logger.error).toBeCalledWith("INVALID_URL", error)

  expect(res.status).toBeCalledWith(400)
  expect(res.json).toBeCalledWith({ message: configErrorMessage })

  // @ts-expect-error
  process.env.NODE_ENV = "test"
})

it("Missing host throws in dev", async () => {
  await expect(
    async () =>
      await nextHandler({
        req: { query: { nextauth: ["session"] } },
      })
  ).rejects.toThrow(Error)
})

it("Missing host config error in prod", async () => {
  // @ts-expect-error
  process.env.NODE_ENV = "production"
  const { res, logger } = await nextHandler({
    req: { query: { nextauth: ["session"] } },
  })
  expect(res.status).toBeCalledWith(400)
  expect(res.json).toBeCalledWith({ message: configErrorMessage })

  expect(logger.error).toBeCalledWith("INVALID_URL", new Error("Missing url"))
  // @ts-expect-error
  process.env.NODE_ENV = "test"
})

it("Defined host throws 400 in production if not trusted", async () => {
  // @ts-expect-error
  process.env.NODE_ENV = "production"
  const { res } = await nextHandler({
    req: { headers: { host: "http://localhost" } },
  })
  expect(res.status).toBeCalledWith(400)
  // @ts-expect-error
  process.env.NODE_ENV = "test"
})

it("Defined host throws 400 in production if trusted but invalid URL", async () => {
  // @ts-expect-error
  process.env.NODE_ENV = "production"
  const { res } = await nextHandler({
    req: { headers: { host: "localhost" } },
    options: { trustHost: true },
  })
  expect(res.status).toBeCalledWith(400)
  // @ts-expect-error
  process.env.NODE_ENV = "test"
})

it("Defined host does not throw in production if trusted and valid URL", async () => {
  // @ts-expect-error
  process.env.NODE_ENV = "production"
  const { res } = await nextHandler({
    req: {
      url: "/api/auth/session",
      headers: { host: "http://localhost" },
    },
    options: { trustHost: true },
  })
  expect(res.status).toBeCalledWith(200)
  // @ts-expect-error
  expect(JSON.parse(res.send.mock.calls[0][0])).toEqual({})
  // @ts-expect-error
  process.env.NODE_ENV = "test"
})

it("Use process.env.NEXTAUTH_URL for host if present", async () => {
  process.env.NEXTAUTH_URL = "http://localhost"
  const { res } = await nextHandler({
    req: { url: "/api/auth/session" },
  })
  expect(res.status).toBeCalledWith(200)
  // @ts-expect-error
  expect(JSON.parse(res.send.mock.calls[0][0])).toEqual({})
})

it("Redirects if necessary", async () => {
  process.env.NEXTAUTH_URL = "http://localhost"
  const { res } = await nextHandler({
    req: {
      method: "post",
      url: "/api/auth/signin/github",
    },
  })
  expect(res.status).toBeCalledWith(302)
  expect(res.getHeaders()).toEqual({
    location: "http://localhost/api/auth/signin?csrf=true",
    "set-cookie": [
      expect.stringMatching(
        /next-auth.csrf-token=.*; Path=\/; HttpOnly; SameSite=Lax/
      ),
      `next-auth.callback-url=${encodeURIComponent(
        process.env.NEXTAUTH_URL
      )}; Path=/; HttpOnly; SameSite=Lax`,
    ],
  })

  expect(res.send).toBeCalledWith("")
})

it("Returns redirect if `X-Auth-Return-Redirect` header is present", async () => {
  process.env.NEXTAUTH_URL = "http://localhost"
  const { res } = await nextHandler({
    req: {
      method: "post",
      url: "/api/auth/signin/github",
      headers: { "X-Auth-Return-Redirect": "1" },
    },
  })

  expect(res.status).toBeCalledWith(200)

  expect(res.getHeaders()).toEqual({
    "content-type": "application/json",
    "set-cookie": [
      expect.stringMatching(
        /next-auth.csrf-token=.*; Path=\/; HttpOnly; SameSite=Lax/
      ),
      `next-auth.callback-url=${encodeURIComponent(
        process.env.NEXTAUTH_URL
      )}; Path=/; HttpOnly; SameSite=Lax`,
    ],
  })

  expect(res.send).toBeCalledWith(
    JSON.stringify({ url: "http://localhost/api/auth/signin?csrf=true" })
  )
})

it("Should preserve user's `set-cookie` headers", async () => {
  const { req, res } = mockReqRes({
    method: "post",
    url: "/api/auth/signin/credentials",
    headers: { host: "localhost", "X-Auth-Return-Redirect": "1" },
  })
  res.setHeader("set-cookie", ["foo=bar", "bar=baz"])

  await nextHandler({ req, res })

  expect(res.getHeaders()).toEqual({
    "content-type": "application/json",
    "set-cookie": [
      "foo=bar",
      "bar=baz",
      expect.stringMatching(
        /next-auth.csrf-token=.*; Path=\/; HttpOnly; SameSite=Lax/
      ),
      `next-auth.callback-url=${encodeURIComponent(
        "http://localhost"
      )}; Path=/; HttpOnly; SameSite=Lax`,
    ],
  })

  expect(res.send).toBeCalledWith(
    JSON.stringify({ url: "http://localhost/api/auth/signin?csrf=true" })
  )
})
