import { createCSRF, handler, mockAdapter } from "./utils"
import EmailProvider from "../src/providers/email"

it("Send e-mail to the only address correctly", async () => {
  const { secret, csrf } = await createCSRF()

  const sendVerificationRequest = jest.fn()
  const signIn = jest.fn(() => true)

  const email = "email@example.com"
  const { res } = await handler(
    {
      adapter: mockAdapter(),
      providers: [EmailProvider({ sendVerificationRequest })],
      callbacks: { signIn },
      secret,
      trustHost: true,
    },
    {
      path: "signin/email",
      requestInit: {
        method: "POST",
        headers: { cookie: csrf.cookie, "content-type": "application/json" },
        body: JSON.stringify({ email: email, csrfToken: csrf.value }),
      },
    }
  )

  expect(res.redirect).toBe(
    "http://localhost:3000/api/auth/verify-request?provider=email&type=email"
  )

  expect(signIn).toBeCalledTimes(1)
  expect(signIn).toHaveBeenCalledWith(
    expect.objectContaining({
      user: expect.objectContaining({ email }),
    })
  )

  expect(sendVerificationRequest).toHaveBeenCalledWith(
    expect.objectContaining({ identifier: email })
  )
})

it("Send e-mail to first address only", async () => {
  const { secret, csrf } = await createCSRF()
  const sendVerificationRequest = jest.fn()
  const signIn = jest.fn(() => true)

  const firstEmail = "email@email.com"
  const email = `${firstEmail},email@email2.com`
  const { res } = await handler(
    {
      adapter: mockAdapter(),
      providers: [EmailProvider({ sendVerificationRequest })],
      callbacks: { signIn },
      secret,
      trustHost: true,
    },
    {
      path: "signin/email",
      requestInit: {
        method: "POST",
        headers: { cookie: csrf.cookie, "content-type": "application/json" },
        body: JSON.stringify({ email: email, csrfToken: csrf.value }),
      },
    }
  )

  expect(res.redirect).toBe(
    "http://localhost:3000/api/auth/verify-request?provider=email&type=email"
  )

  expect(signIn).toBeCalledTimes(1)
  expect(signIn).toHaveBeenCalledWith(
    expect.objectContaining({
      user: expect.objectContaining({ email: firstEmail }),
    })
  )

  expect(sendVerificationRequest).toHaveBeenCalledWith(
    expect.objectContaining({ identifier: firstEmail })
  )
})

it("Send e-mail to address with first domain", async () => {
  const { secret, csrf } = await createCSRF()
  const sendVerificationRequest = jest.fn()
  const signIn = jest.fn(() => true)

  const firstEmail = "email@email.com"
  const email = `${firstEmail},email2.com`
  const { res } = await handler(
    {
      adapter: mockAdapter(),
      providers: [EmailProvider({ sendVerificationRequest })],
      callbacks: { signIn },
      secret,
      trustHost: true,
    },
    {
      path: "signin/email",
      requestInit: {
        method: "POST",
        headers: { cookie: csrf.cookie, "content-type": "application/json" },
        body: JSON.stringify({ email: email, csrfToken: csrf.value }),
      },
    }
  )

  expect(res.redirect).toBe(
    "http://localhost:3000/api/auth/verify-request?provider=email&type=email"
  )

  expect(signIn).toBeCalledTimes(1)
  expect(signIn).toHaveBeenCalledWith(
    expect.objectContaining({
      user: expect.objectContaining({ email: firstEmail }),
    })
  )

  expect(sendVerificationRequest).toHaveBeenCalledWith(
    expect.objectContaining({ identifier: firstEmail })
  )
})

it("Redirect to error page if multiple addresses aren't allowed", async () => {
  const { secret, csrf } = await createCSRF()
  const sendVerificationRequest = jest.fn()
  const signIn = jest.fn()
  const error = new Error("Only one email allowed")
  const { res, log } = await handler(
    {
      adapter: mockAdapter(),
      callbacks: { signIn },
      providers: [
        EmailProvider({
          sendVerificationRequest,
          normalizeIdentifier(identifier) {
            if (identifier.split("@").length > 2) throw error
            return identifier
          },
        }),
      ],
      secret,
      trustHost: true,
    },
    {
      path: "signin/email",
      requestInit: {
        method: "POST",
        headers: { cookie: csrf.cookie, "content-type": "application/json" },
        body: JSON.stringify({
          email: "email@email.com,email@email2.com",
          csrfToken: csrf.value,
        }),
      },
    }
  )

  expect(signIn).toBeCalledTimes(0)
  expect(sendVerificationRequest).toBeCalledTimes(0)

  expect(log.error.mock.calls[0]).toEqual([
    "SIGNIN_EMAIL_ERROR",
    { error, providerId: "email" },
  ])

  expect(res.redirect).toBe(
    "http://localhost:3000/api/auth/error?error=EmailSignin"
  )
})
