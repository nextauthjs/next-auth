import { encode, getToken } from "../src/jwt"

describe("getToken", () => {
  const secret = "secret"

  it("returns null for a malformed percent-encoded Bearer token", async () => {
    for (const value of ["%", "%A", "%ZZ"]) {
      const req = {
        headers: new Headers({ authorization: `Bearer ${value}` }),
      } as any
      await expect(getToken({ req, secret })).resolves.toBeNull()
    }
  })

  it("returns null for a malformed Bearer token when raw is set", async () => {
    const req = {
      headers: new Headers({ authorization: "Bearer %" }),
    } as any
    await expect(getToken({ req, secret, raw: true })).resolves.toBeNull()
  })

  it("still reads a valid Bearer token", async () => {
    const jwt = await encode({ token: { foo: "bar" }, secret })
    const req = {
      headers: new Headers({
        authorization: `Bearer ${encodeURIComponent(jwt)}`,
      }),
    } as any
    await expect(getToken({ req, secret, raw: true })).resolves.toBe(jwt)
  })
})
