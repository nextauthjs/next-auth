import { describe, it, expect } from "vitest"
import { merge } from "../src/lib/utils/merge"

describe("merge function", () => {
  it("should merge objects correctly", () => {
    expect(merge({ a: 1, b: { c: 2 } }, { b: { c: 3, d: 4 } })).toEqual({
      a: 1,
      b: { c: 3, d: 4 },
    })
  })

  it("should override primitive values", () => {
    expect(merge({ a: 1, b: "old" }, { b: "new" })).toEqual({ a: 1, b: "new" })
  })

  it("should override arrays", () => {
    expect(merge({ a: [1, 2] }, { a: [3, 4] })).toEqual({ a: [3, 4] })
  })

  it("should handle nested objects", () => {
    expect(merge({ a: { b: { c: 1 } } }, { a: { b: { d: 2 } } })).toEqual({
      a: { b: { c: 1, d: 2 } },
    })
  })

  it("should handle null and undefined", () => {
    expect(
      merge({ a: undefined, b: undefined }, { a: null, b: 2, c: 3 })
    ).toEqual({ a: null, b: 2, c: 3 })
  })

  it("should merge multiple objects", () => {
    expect(merge({ a: 1 }, { b: 2 }, { b: { d: 2 }, c: "new" })).toEqual({
      a: 1,
      b: { d: 2 },
      c: "new",
    })
  })

  it("should handle empty objects", () => {
    expect(merge({ a: 1 }, {})).toEqual({ a: 1 })
  })

  it("should override functions", () => {
    expect(
      merge(
        {
          func: () => "original",
          nested: { func: () => "original nested" },
        },
        {
          func: () => "overridden",
          nested: { func: () => "overridden nested" },
        }
      ).func()
    ).toBe("overridden")
    expect(
      merge(
        {
          func: () => "original",
          nested: { func: () => "original nested" },
        },
        {
          func: () => "overridden",
          nested: { func: () => "overridden nested" },
        }
      ).nested.func()
    ).toBe("overridden nested")
  })

  it("should override default authorization config with user provided object", () => {
    expect(
      merge(
        {
          authorization: "https://example.com/default",
        },
        {
          authorization: {
            url: "https://example.com/user-config",
            params: { scope: "email,user_friends" },
          },
        }
      )
    ).toEqual({
      authorization: {
        url: "https://example.com/user-config",
        params: { scope: "email,user_friends" },
      },
    })
  })

  it("should correctly merge scopes in authorization params", () => {
    expect(
      merge(
        {
          authorization: {
            url: "https://example.com/default",
            params: { scope: "identify,email" },
          },
          defaultOptions: "",
        },
        {
          authorization: "https://example.com/user-config",
        }
      )
    ).toEqual({
      defaultOptions: "",
      authorization: "https://example.com/user-config",
    })
  })
})
