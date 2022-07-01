import { createCSRF, handler } from "./lib"
import EmailProvider from "../src/providers/email"

const originalEmail = "balazs@email.com"

test.each([
  [originalEmail, `,<a href="example.com">Click here!</a>`],
  [originalEmail, ""],
])("Sanitize email", async (emailOriginal, emailCompromised) => {
  const sendEmail = jest.fn()

  const { secret, csrf } = createCSRF()

  const email = {
    original: emailOriginal,
    compromised: `${emailOriginal}${emailCompromised}`,
  }

  const { res } = await handler(
    {
      providers: [EmailProvider({ sendVerificationRequest: sendEmail })],
      adapter: {
        getUserByEmail: (email) => ({ id: "1", email, emailVerified: null }),
        createVerificationToken: (token) => token,
      } as any,
      secret,
    },
    {
      prod: true,
      path: "signin/email",
      requestInit: {
        method: "POST",
        body: JSON.stringify({
          email: email.compromised,
          csrfToken: csrf.value,
        }),
        headers: { "Content-Type": "application/json", Cookie: csrf.cookie },
      },
    }
  )

  if (!emailCompromised) {
    expect(res.redirect).toBe(
      "http://localhost:3000/api/auth/verify-request?provider=email&type=email"
    )
    expect(sendEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        identifier: email.original,
        token: expect.any(String),
      })
    )
  } else {
    expect(res.redirect).not.toContain("error=EmailSignin")

    const emailTo = sendEmail.mock.calls[0][0].identifier
    expect(emailTo).not.toBe(email.compromised)
    expect(emailTo).toBe(email.original)
  }
})
