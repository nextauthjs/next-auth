import { SessionStore } from "../src/core/lib/cookie"

it("should result in the correct cookie order", async () => {
  const cookieName = "__Secure-next-auth.session-token"
  const logger = console
  const sessionStore = new SessionStore(
    { name: cookieName, options: { secure: true } },
    {
      cookies: {
        [`${cookieName}.2`]: "2",
        [`${cookieName}.0`]: "0",
        [`${cookieName}.1`]: "1",
      },
      headers: {
        cookie: `${cookieName}.2=2; ${cookieName}.0=0; ${cookieName}.1=1`,
      },
    },
    logger
  )

  // Order should always follow numeric order of keys
  expect(sessionStore.value).toBe("012")
})
