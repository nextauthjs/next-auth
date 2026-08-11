import { describe, it, expect } from "vitest"
import { defaultNormalizer } from "../src/lib/actions/signin/send-token"

describe("defaultNormalizer", () => {
  it("normalizes a valid email", () => {
    expect(defaultNormalizer("Foo@Example.com")).toBe("foo@example.com")
    expect(defaultNormalizer("  foo@example.com  ")).toBe("foo@example.com")
  })

  it("keeps the first domain when the domain part is comma-separated", () => {
    expect(defaultNormalizer("foo@example.com,evil.com")).toBe(
      "foo@example.com"
    )
  })

  it("throws on a missing email", () => {
    expect(() => defaultNormalizer(undefined)).toThrow()
    expect(() => defaultNormalizer("")).toThrow()
  })

  it("rejects quotes (address parser confusion)", () => {
    expect(() => defaultNormalizer('"foo@evil.com"@example.com')).toThrow(
      "Invalid email address format."
    )
  })

  it("rejects multiple ASCII @ symbols", () => {
    expect(() => defaultNormalizer("foo@evil.com@example.com")).toThrow(
      "Invalid email address format."
    )
  })

  // Regression test for GHSA-7rqj-j65f-68wh:
  // U+FF20 (FULLWIDTH COMMERCIAL AT) is a homoglyph of `@` that normalizes to
  // ASCII `@` under NFKC. It must be canonicalized before validation so the
  // address cannot smuggle a second `@` past the single-`@` check.
  it("rejects a Unicode homoglyph of @ (U+FF20)", () => {
    expect(() =>
      defaultNormalizer("attacker@evil.com＠victim.company.com")
    ).toThrow("Invalid email address format.")
  })

  it("rejects other fullwidth/homoglyph @ characters", () => {
    // U+FE6B SMALL COMMERCIAL AT also normalizes to `@` under NFKC.
    expect(() =>
      defaultNormalizer("attacker@evil.com﹫victim.company.com")
    ).toThrow("Invalid email address format.")
  })
})
