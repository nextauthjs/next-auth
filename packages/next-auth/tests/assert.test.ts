import { InvalidCallbackUrl, MissingSecret } from "../src/core/errors"
import { handler } from "./lib"

it("Show error page if secret is not defined", async () => {
  const { res, log } = await handler(
    { providers: [], secret: undefined },
    { prod: true }
  )

  expect(res.status).toBe(500)
  expect(res.html).toMatch(/there is a problem with the server configuration./i)
  expect(res.html).toMatch(/check the server logs for more information./i)

  expect(log.error).toBeCalledWith("NO_SECRET", expect.any(MissingSecret))
})

it("Should show configuration error page on invalid `callbackUrl`", async () => {
  const { res, log } = await handler(
    { providers: [] },
    { prod: true, params: { callbackUrl: "invalid-callback" } }
  )

  expect(res.status).toBe(500)
  expect(res.html).toMatch(/there is a problem with the server configuration./i)
  expect(res.html).toMatch(/check the server logs for more information./i)

  expect(log.error).toBeCalledWith(
    "INVALID_CALLBACK_URL_ERROR",
    expect.any(InvalidCallbackUrl)
  )
})

it("Allow relative `callbackUrl`", async () => {
  const { res, log } = await handler(
    { providers: [] },
    { prod: true, params: { callbackUrl: "/callback" } }
  )

  expect(res.status).not.toBe(500)
  expect(log.error).not.toBeCalledWith(
    "INVALID_CALLBACK_URL_ERROR",
    expect.any(InvalidCallbackUrl)
  )
})
