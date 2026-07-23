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

  it("should handle merging Date object", () => {
    const target = {
      sessionToken: {
        name: "authjs.session-token",
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: false,
        },
      },
    }
    const source = {
      sessionToken: {
        options: {
          expires: new Date("2024-01-01T00:00:00Z"),
        },
      },
    }

    const expected = {
      sessionToken: {
        name: "authjs.session-token",
        options: {
          httpOnly: true,
          sameSite: "lax",
          path: "/",
          secure: false,
          expires: source.sessionToken.options.expires,
        },
      },
    }

    expect(merge(target, source)).toEqual(expected)
  })

  it("should handle RegExp objects", () => {
    const target = { pattern: /old/g }
    const source = { pattern: /new/i }

    const result = merge(target, source)
    expect(result.pattern).toEqual(/new/i)
    expect(result.pattern.flags).toBe("i")
  })

  it("should handle Error objects", () => {
    const target = { error: new Error("old error") }
    const source = { error: new TypeError("new error") }

    const result = merge(target, source)
    expect(result.error).toBeInstanceOf(TypeError)
    expect(result.error.message).toBe("new error")
  })

  it("should handle mixed types correctly", () => {
    const target = {
      number: 1,
      string: "hello",
      boolean: true,
      array: [1, 2, 3],
      object: { nested: "value" },
      nullValue: null,
      undefinedValue: undefined,
    }

    const source = {
      number: 2,
      string: "world",
      boolean: false,
      array: [4, 5],
      object: { nested: "new value", added: "property" },
      nullValue: "not null anymore",
      undefinedValue: "defined now",
      newProperty: "brand new",
    }

    const result = merge(target, source)

    expect(result).toEqual({
      number: 2,
      string: "world",
      boolean: false,
      array: [4, 5],
      object: { nested: "new value", added: "property" },
      nullValue: "not null anymore",
      undefinedValue: "defined now",
      newProperty: "brand new",
    })
  })

  it("should mutate the target object", () => {
    const target = { a: 1, b: { c: 2 } }
    const source = { b: { d: 3 } }
    const originalTarget = JSON.parse(JSON.stringify(target))
    const originalSource = JSON.parse(JSON.stringify(source))

    const result = merge(target, source)

    // Target should be mutated
    expect(target).not.toEqual(originalTarget)
    expect(target).toBe(result) // Should return the same reference
    expect(target.b.c).toBe(2) // Original nested properties preserved
    expect((target.b as any).d).toBe(3) // New properties added

    // Source should not be mutated
    expect(source).toEqual(originalSource)
  })

  it("should handle deeply nested objects", () => {
    const target = {
      level1: {
        level2: {
          level3: {
            level4: {
              value: "original",
            },
          },
        },
      },
    }

    const source = {
      level1: {
        level2: {
          level3: {
            level4: {
              value: "updated",
              newValue: "added",
            },
            newLevel4: "added",
          },
          newLevel3: "added",
        },
        newLevel2: "added",
      },
      newLevel1: "added",
    }

    const result = merge(target, source)

    expect(result).toEqual({
      level1: {
        level2: {
          level3: {
            level4: {
              value: "updated",
              newValue: "added",
            },
            newLevel4: "added",
          },
          newLevel3: "added",
        },
        newLevel2: "added",
      },
      newLevel1: "added",
    })
  })

  it("should handle class instances correctly", () => {
    class TestClass {
      constructor(public value: string) {}
    }

    const target = { instance: new TestClass("original") }
    const source = { instance: new TestClass("updated") }

    const result = merge(target, source)
    expect(result.instance).toBeInstanceOf(TestClass)
    expect(result.instance.value).toBe("updated")
  })

  it("should handle symbols as values", () => {
    const sym1 = Symbol("test1")
    const sym2 = Symbol("test2")

    const target = { symbol: sym1 }
    const source = { symbol: sym2 }

    const result = merge(target, source)
    expect(result.symbol).toBe(sym2)
  })

  it("should handle arrays with objects", () => {
    const target = { items: [{ id: 1, name: "item1" }] }
    const source = {
      items: [
        { id: 2, name: "item2" },
        { id: 3, name: "item3" },
      ],
    }

    const result = merge(target, source)
    expect(result.items).toEqual([
      { id: 2, name: "item2" },
      { id: 3, name: "item3" },
    ])
  })

  it("should handle empty arrays", () => {
    const target = { items: [1, 2, 3] }
    const source = { items: [] }

    const result = merge(target, source)
    expect(result.items).toEqual([])
  })

  it("should handle constructor property", () => {
    const target = { constructor: Object }
    const source = { constructor: Array }

    const result = merge(target, source)
    expect(result.constructor).toBe(Array)
  })

  it("should handle Map and Set objects", () => {
    const map1 = new Map([["key1", "value1"]])
    const map2 = new Map([["key2", "value2"]])
    const set1 = new Set([1, 2])
    const set2 = new Set([3, 4])

    const target = { map: map1, set: set1 }
    const source = { map: map2, set: set2 }

    const result = merge(target, source)
    expect(result.map).toBe(map2)
    expect(result.set).toBe(set2)
  })

  it("should handle objects with numeric keys", () => {
    const target = { 0: "zero", 1: "one" }
    const source = { 1: "updated one", 2: "two" }

    const result = merge(target, source)
    expect(result).toEqual({ 0: "zero", 1: "updated one", 2: "two" })
  })
})
