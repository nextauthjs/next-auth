import { describe, it, expect } from "vitest"
import { encode, decode } from "../jwt"
import { getToken } from "../src/jwt"

describe("supports secret rotation", () => {
  const token = { foo: "bar" }
  const s1 = "secret1"
  const s2 = "secret2"
  const s3 = "secret3"
  const s12 = [s1, s2]

  const salt = "salt"

  it("can decode tokens that were encoded with different secrets", async () => {
    const t1 = await encode({ salt, token, secret: s1 })
    const d1 = await decode({ salt, token: t1, secret: s12 })
    expect(d1?.foo).toEqual(token.foo)

    const t2 = await encode({ salt, token, secret: s2 })
    const d2 = await decode({ salt, token: t2, secret: s12 })
    expect(d2?.foo).toEqual(token.foo)
  })

  it("always encodes with leftmost secret", async () => {
    const t1 = await encode({ salt, token, secret: s12 })

    const d1 = await decode({ salt, token: t1, secret: s1 })
    expect(d1?.foo).toEqual(token.foo)

    const d2 = decode({ salt, token: t1, secret: s2 })
    expect(() => d2).rejects.toEqual(new Error("no matching decryption secret"))
  })

  it("should not be able decode with non-matching secret", async () => {
    const t1 = await encode({ salt, token, secret: s3 })
    const decoded = decode({ salt, token: t1, secret: s12 })
    expect(() => decoded).rejects.toEqual(
      new Error("no matching decryption secret")
    )
  })
})

describe("getToken", () => {
  const secret = "secret"

  it("returns null for a malformed percent-encoded Bearer token", async () => {
    for (const value of ["%", "%A", "%ZZ"]) {
      const req = {
        headers: new Headers({ authorization: `Bearer ${value}` }),
      }
      await expect(getToken({ req, secret })).resolves.toBeNull()
    }
  })

  it("returns null for a malformed Bearer token when raw is set", async () => {
    const req = {
      headers: new Headers({ authorization: "Bearer %" }),
    }
    await expect(getToken({ req, secret, raw: true })).resolves.toBeNull()
  })

  it("still reads a valid Bearer token", async () => {
    const salt = "authjs.session-token"
    const jwt = await encode({ salt, token: { foo: "bar" }, secret })
    const req = {
      headers: new Headers({
        authorization: `Bearer ${encodeURIComponent(jwt)}`,
      }),
    }
    const decoded = await getToken({ req, secret })
    expect(decoded?.foo).toEqual("bar")
  })
})
