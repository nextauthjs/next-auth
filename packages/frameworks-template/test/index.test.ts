import { describe, expect, it } from "vitest"
import { FrameworkAuth } from "../src"

describe("Sample test", () => {
  it("should throw an error", () => {
    expect(() => {
      FrameworkAuth()
    }).toThrow("Not implemented")
  })
})
