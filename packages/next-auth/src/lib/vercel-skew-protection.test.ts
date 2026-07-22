import { afterEach, describe, expect, it, vi } from "vitest"

import {
  getSkewProtectionHeaderInit,
  resolveDeploymentIdForSkewProtection,
} from "./vercel-skew-protection.js"

afterEach(() => {
  vi.unstubAllEnvs()
  ;(globalThis as Record<string, unknown>).NEXT_DEPLOYMENT_ID = undefined
})

describe("resolveDeploymentIdForSkewProtection", () => {
  it("prefers globalThis.NEXT_DEPLOYMENT_ID", () => {
    ;(globalThis as Record<string, unknown>).NEXT_DEPLOYMENT_ID = "dpl_global"
    expect(resolveDeploymentIdForSkewProtection()).toBe("dpl_global")
  })

  it("uses VERCEL_DEPLOYMENT_ID when global is unset", () => {
    vi.stubEnv("VERCEL_DEPLOYMENT_ID", "dpl_env")
    expect(resolveDeploymentIdForSkewProtection()).toBe("dpl_env")
  })
})

describe("getSkewProtectionHeaderInit", () => {
  it("returns empty when skew protection is disabled", () => {
    vi.stubEnv("VERCEL_SKEW_PROTECTION_ENABLED", "0")
    vi.stubEnv("VERCEL_DEPLOYMENT_ID", "dpl_x")
    expect(getSkewProtectionHeaderInit()).toEqual({})
  })

  it("returns x-deployment-id when enabled and id is resolvable", () => {
    vi.stubEnv("VERCEL_SKEW_PROTECTION_ENABLED", "1")
    vi.stubEnv("VERCEL_DEPLOYMENT_ID", "dpl_abc")
    expect(getSkewProtectionHeaderInit()).toEqual({
      "x-deployment-id": "dpl_abc",
    })
  })
})
