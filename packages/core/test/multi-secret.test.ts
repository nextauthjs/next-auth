import { describe, it, expect } from "vitest"
import { encode, decode } from "../jwt"

describe.only("supports secret rotation", () => {
  const payload = { foo: "bar" }
  const s1 = "secret1"
  const s2 = "secret2"
  const s3 = "secret3"
  const s12 = [s1, s2]
  const common = { salt: "", token: payload }

  it("can decode multiple tokens with different secrets", async () => {
    const t1 = await encode({ ...common, secret: s1 })
    const t2 = await encode({ ...common, secret: s2 })

    const d1 = await decode({ salt: "", token: t1, secret: s12 })
    expect(d1?.foo).toEqual(payload.foo)

    const d2 = await decode({ salt: "", token: t2, secret: s12 })
    expect(d2?.foo).toEqual(payload.foo)
  })

  it("should throw error when no matching secret was passed", async () => {
    const token = await encode({ ...common, secret: s3 })
    const decoded = decode({ salt: "", token, secret: s12 })
    expect(() => decoded).rejects.toEqual(
      new Error("no matching decryption secret")
    )
  })
})
