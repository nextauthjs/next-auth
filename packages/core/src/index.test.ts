import { describe, expect, it } from "vitest"
import { Auth, AuthConfig } from "./index.js"
import GitHub from "./providers/github"
import { SESSION_ACTION, SESSION_COOKIE_NAME } from "./test/constants.js"
import { decode, encode } from "./jwt.js"
import { parse } from "cookie"

const authConfig: AuthConfig = {
  providers: [GitHub],
  trustHost: true,
  secret: "secret",
}

describe("session suite", () => {
  it("should return a valid session response", async () => {
    const expectedSession = {
      name: "test",
      email: "test@test.com",
      picture: "https://test.com/test.png",
    }
    const encoded = await encode({
      salt: SESSION_COOKIE_NAME,
      secret: "secret",
      token: expectedSession,
    })
    const request = new Request(SESSION_ACTION, {
      headers: {
        cookie: `${SESSION_COOKIE_NAME}=${encoded}`,
      },
    })
    const response = (await Auth(request, authConfig)) as Response

    let cookies = {} as Record<string, string>
    for (const [name, value] of response.headers.entries()) {
      if (name === "set-cookie") {
        const cookie = parse(value)
        cookies = { ...cookies, ...cookie }
      }
    }
    const sessionToken = cookies[SESSION_COOKIE_NAME]
    const decoded = await decode<{
      // TODO: This shouldn't be necessary?
      exp: number
      iat: number
      jti: string
    }>({
      salt: SESSION_COOKIE_NAME,
      secret: "secret",
      token: sessionToken,
    })

    if (!decoded) throw new Error("Unexpected, decoded session is null")

    const { exp, iat, jti, ...actualSession } = decoded

    expect(actualSession).toEqual(expectedSession)
  })
})
