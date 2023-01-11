import {
  InvalidCallbackUrl,
  MissingAdapter,
  MissingAdapterMethods,
  MissingSecret,
} from "../src/core/errors"
import { handler } from "./utils"
import EmailProvider from "../src/providers/email"

it("Show error page if secret is not defined", async () => {
  const { res, log } = await handler(
    { providers: [], secret: undefined, trustHost: true },
    { prod: true }
  )

  expect(res.status).toBe(500)
  expect(res.html).toMatch(/there is a problem with the server configuration./i)
  expect(res.html).toMatch(/check the server logs for more information./i)

  expect(log.error).toBeCalledWith("NO_SECRET", expect.any(MissingSecret))
})

it("Show error page if adapter is missing functions when using with email", async () => {
  const sendVerificationRequest = jest.fn()
  const missingFunctionAdapter: any = {}
  const { res, log } = await handler(
    {
      adapter: missingFunctionAdapter,
      providers: [EmailProvider({ sendVerificationRequest })],
      secret: "secret",
      trustHost: true,
    },
    { prod: true }
  )

  expect(res.status).toBe(500)
  expect(res.html).toMatch(/there is a problem with the server configuration./i)
  expect(res.html).toMatch(/check the server logs for more information./i)

  expect(log.error).toBeCalledWith(
    "MISSING_ADAPTER_METHODS_ERROR",
    expect.any(MissingAdapterMethods)
  )
})

it("Show error page if adapter is not configured when using with email", async () => {
  const sendVerificationRequest = jest.fn()
  const { res, log } = await handler(
    {
      providers: [EmailProvider({ sendVerificationRequest })],
      secret: "secret",
      trustHost: true,
    },
    { prod: true }
  )

  expect(res.status).toBe(500)
  expect(res.html).toMatch(/there is a problem with the server configuration./i)
  expect(res.html).toMatch(/check the server logs for more information./i)

  expect(log.error).toBeCalledWith(
    "EMAIL_REQUIRES_ADAPTER_ERROR",
    expect.any(MissingAdapter)
  )
})

it("Should show configuration error page on invalid `callbackUrl`", async () => {
  const { res, log } = await handler(
    { providers: [], trustHost: true },
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
    { providers: [], trustHost: true },
    { prod: true, params: { callbackUrl: "/callback" } }
  )

  expect(res.status).not.toBe(500)
  expect(log.error).not.toBeCalledWith(
    "INVALID_CALLBACK_URL_ERROR",
    expect.any(InvalidCallbackUrl)
  )
})
