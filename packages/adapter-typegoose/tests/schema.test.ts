import { instanceToPlain, plainToClass } from "class-transformer"
import { VerificationTokenSchema } from "../src/schemas/verifycation-token"
import type { VerificationToken } from "next-auth/adapters"

describe("VerificationTokenSchema", () => {
  it("should return a valid class from plain object", () => {
    const data: VerificationToken = {
      identifier: "test",
      token: "test",
      expires: new Date(),
    }

    const token = plainToClass(VerificationTokenSchema, data)
    expect(token).toBeInstanceOf(VerificationTokenSchema)

    const serialized = instanceToPlain(token)
    expect(serialized).toEqual(data)
  })
})
