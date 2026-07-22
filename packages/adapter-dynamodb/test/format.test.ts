import { describe, expect, test } from "vitest"
import { format } from "../src"
import { from } from "./format_util.ts"

describe("dynamodb utils.format", () => {
  test("format.to() preserves non-Date non-expires properties", () => {
    expect(
      format.to({
        pk: "test-pk",
        email: "test@example.com",
      })
    ).toEqual({
      pk: "test-pk",
      email: "test@example.com",
    })
  })

  test("format.to() converts non-expires Date properties to ISO strings", () => {
    const date = new Date()
    expect(
      format.to({
        dateProp: date,
      })
    ).toEqual({
      dateProp: date.toISOString(),
    })
  })

  test("format.to() converts expires property to a UNIX timestamp", () => {
    // DynamoDB requires that the property used for TTL is a UNIX timestamp.
    const date = new Date()
    const timestamp = date.getTime() / 1000
    expect(
      format.to({
        expires: date,
      })
    ).toEqual({
      expires: timestamp,
    })
  })

  // `from` now requires formatting options; The imported `from` has the defaults set already
  // to make testing a little easier.
  test("format.from() preserves non-special attributes", () => {
    expect(
      from({
        testAttr1: "test-value",
        testAttr2: 5,
      })
    ).toEqual({
      testAttr1: "test-value",
      testAttr2: 5,
    })
  })

  test("format.from() removes dynamodb key attributes", () => {
    expect(
      from({
        pk: "test-pk",
        sk: "test-sk",
        GSI1PK: "test-GSI1PK",
        GSI1SK: "test-GSI1SK",
      })
    ).toEqual({})
  })

  test("format.from() only removes type attribute from Session, VT, and User", () => {
    expect(from({ type: "SESSION" })).toEqual({})
    expect(from({ type: "VT" })).toEqual({})
    expect(from({ type: "USER" })).toEqual({})
    expect(from({ type: "ANYTHING" })).toEqual({ type: "ANYTHING" })
    expect(from({ type: "ELSE" })).toEqual({ type: "ELSE" })
  })

  test("format.from() converts ISO strings to Date instances", () => {
    const date = new Date()
    expect(
      from({
        someDate: date.toISOString(),
      })
    ).toEqual({
      someDate: date,
    })
  })

  test("format.from() converts expires attribute from timestamp to Date instance", () => {
    // AdapterSession["expires"] and VerificationToken["expires"] are both meant
    // to be Date instances.
    const date = new Date()
    const timestamp = date.getTime() / 1000
    expect(
      from({
        expires: timestamp,
      })
    ).toEqual({
      expires: date,
    })
  })

  test("format.from() converts expires attribute from ISO string to Date instance", () => {
    // Due to a bug in an old version, some expires attributes were stored as
    // ISO strings, so we need to handle those properly too.
    const date = new Date()
    expect(
      from({
        expires: date.toISOString(),
      })
    ).toEqual({
      expires: date,
    })
  })

  test("format.from(format.to()) preserves expires attribute", () => {
    const date = new Date()
    expect(
      from(
        format.to({
          expires: date,
        })
      )
    ).toEqual({
      expires: date,
    })
  })
})
