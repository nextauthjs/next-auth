import { format } from "../src/utils"

describe("dynamodb utils.format", () => {
  it("format.to() preserves non-Date non-expires properties", () => {
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

  it("format.to() converts non-expires Date properties to ISO strings", () => {
    const date = new Date()
    expect(
      format.to({
        dateProp: date,
      })
    ).toEqual({
      dateProp: date.toISOString(),
    })
  })

  it("format.to() converts expires property to a UNIX timestamp", () => {
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

  it("format.from() preserves non-special attributes", () => {
    expect(
      format.from({
        testAttr1: "test-value",
        testAttr2: 5,
      })
    ).toEqual({
      testAttr1: "test-value",
      testAttr2: 5,
    })
  })

  it("format.from() removes dynamodb key attributes", () => {
    expect(
      format.from({
        pk: "test-pk",
        sk: "test-sk",
        GSI1PK: "test-GSI1PK",
        GSI1SK: "test-GSI1SK",
      })
    ).toEqual({})
  })

  it("format.from() only removes type attribute from Session, VT, and User", () => {
    expect(format.from({ type: "SESSION" })).toEqual({})
    expect(format.from({ type: "VT" })).toEqual({})
    expect(format.from({ type: "USER" })).toEqual({})
    expect(format.from({ type: "ANYTHING" })).toEqual({ type: "ANYTHING" })
    expect(format.from({ type: "ELSE" })).toEqual({ type: "ELSE" })
  })

  it("format.from() converts ISO strings to Date instances", () => {
    const date = new Date()
    expect(
      format.from({
        someDate: date.toISOString(),
      })
    ).toEqual({
      someDate: date,
    })
  })

  it("format.from() converts expires attribute from timestamp to Date instance", () => {
    // AdapterSession["expires"] and VerificationToken["expires"] are both meant
    // to be Date instances.
    const date = new Date()
    const timestamp = date.getTime() / 1000
    expect(
      format.from({
        expires: timestamp,
      })
    ).toEqual({
      expires: date,
    })
  })

  it("format.from() converts expires attribute from ISO string to Date instance", () => {
    // Due to a bug in an old version, some expires attributes were stored as
    // ISO strings, so we need to handle those properly too.
    const date = new Date()
    expect(
      format.from({
        expires: date.toISOString(),
      })
    ).toEqual({
      expires: date,
    })
  })

  it("format.from(format.to()) preserves expires attribute", () => {
    const date = new Date()
    expect(
      format.from(
        format.to({
          expires: date,
        })
      )
    ).toEqual({
      expires: date,
    })
  })
})
