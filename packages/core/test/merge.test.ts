import { describe, it, expect } from "vitest"
import { merge } from "../src/lib/utils/merge"

describe("merge function", () => {
  it("should merge objects correctly", () => {
    const obj1 = { a: 1, b: { c: 2 } }
    const obj2 = { b: { c: 3, d: 4 } }
    const result = merge(obj1, obj2)
    expect(result).toEqual({ a: 1, b: { c: 3, d: 4 } })
  })

  it("should override primitive values", () => {
    const obj1 = { a: 1, b: "old" }
    const obj2 = { b: "new" }
    const result = merge(obj1, obj2)
    expect(result).toEqual({ a: 1, b: "new" })
  })

  it("should override arrays", () => {
    const obj1 = { a: [1, 2] }
    const obj2 = { a: [3, 4] }
    const result = merge(obj1, obj2)
    expect(result).toEqual({ a: [3, 4] })
  })

  it("should handle nested objects", () => {
    const obj1 = { a: { b: { c: 1 } } }
    const obj2 = { a: { b: { d: 2 } } }
    const result = merge(obj1, obj2)
    expect(result).toEqual({ a: { b: { c: 1, d: 2 } } })
  })

  it("should handle null and undefined", () => {
    const obj1 = { a: undefined, b: undefined }
    const obj2 = { a: null, b: 2, c: 3 }
    const result = merge(obj1, obj2)
    expect(result).toEqual({ a: null, b: 2, c: 3 })
  })

  it("should merge multiple objects", () => {
    const obj1 = { a: 1 }
    const obj2 = { b: 2 }
    const obj3 = { b: { d: 2 }, c: "new" }
    const result = merge(obj1, obj2, obj3)
    expect(result).toEqual({ a: 1, b: { d: 2 }, c: "new" })
  })

  it("should handle empty objects", () => {
    const obj1 = { a: 1 }
    const obj2 = {}
    const result = merge(obj1, obj2)
    expect(result).toEqual({ a: 1 })
  })

  it("should override functions", () => {
    const obj1 = {
      func: () => "original",
      nested: { func: () => "original nested" },
    }
    const obj2 = {
      func: () => "overridden",
      nested: { func: () => "overridden nested" },
    }
    const result = merge(obj1, obj2)
    expect(result.func()).toBe("overridden")
    expect(result.nested.func()).toBe("overridden nested")
  })

  it("should override default authorization config with user provided object", () => {
    const defaultConfig = {
      authorization: "https://example.com/default",
    }

    const userConfig = {
      authorization: {
        url: "https://example.com/user-config",
        params: { scope: "email,user_friends" },
      },
    }

    const result = merge(defaultConfig, userConfig)
    expect(result).toEqual(userConfig)
  })

  it("should correctly merge scopes in authorization params", () => {
    const defaultConfig = {
      authorization: {
        url: "https://example.com/default",
        params: { scope: "identify,email" },
      },
      defaultOptions: "",
    }

    const userConfig = {
      authorization: "https://example.com/user-config",
    }

    const result = merge(defaultConfig, userConfig)
    expect(result).toEqual({
      defaultOptions: "",
      authorization: "https://example.com/user-config",
    })
  })
})
