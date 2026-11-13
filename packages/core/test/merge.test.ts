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

  // https://github.com/nextauthjs/next-auth/issues/8540
  describe("non-plain objects and cycles", () => {
    it("should merge nested plain objects as before", () => {
      expect(
        merge(
          { a: { b: { c: 1 }, keep: true } },
          { a: { b: { d: 2 } } },
          { a: { e: [1] } }
        )
      ).toEqual({ a: { b: { c: 1, d: 2 }, keep: true, e: [1] } })
    })

    it("should index-merge arrays and keep leftover target indexes", () => {
      expect(
        merge({ checks: ["pkce", "state"] }, { checks: ["nonce"] })
      ).toEqual({ checks: ["nonce", "state"] })
    })

    it("should keep a Date by reference instead of turning it into {}", () => {
      const date = new Date("2020-01-01T00:00:00.000Z")
      const result = merge({ a: 1 }, { when: date })
      expect(result.when).toBe(date)
      expect(result.when).toBeInstanceOf(Date)
    })

    it("should keep a class instance with a cycle by reference without throwing", () => {
      class Transport {
        self: Transport = this
        options = { nested: { value: 1 } }
      }
      const transport = new Transport()
      const result = merge(
        { server: { host: "localhost" } },
        {
          server: transport,
        }
      )
      expect(result.server).toBe(transport)
    })

    it("should not throw on a plain-object cycle", () => {
      const source: Record<string, unknown> = { a: 1 }
      source.self = source
      const result = merge({}, source) as Record<string, unknown>
      expect(result.a).toBe(1)
      expect(result.self).toBe(source)
    })

    it("should skip undefined values", () => {
      expect(merge({ a: 1 }, { a: undefined, b: undefined })).toEqual({ a: 1 })
    })
  })
})
