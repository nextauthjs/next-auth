import { detectOrigin } from "../src/utils/detect-origin"

// An explicitly configured `NEXTAUTH_URL` should always take precedence over the
// auto-detected forwarded host, including when trusted-host mode is enabled via
// `AUTH_TRUST_HOST` or a platform default such as `VERCEL`.

const FORWARDED_HOST = "forwarded.example.test"
const CONFIGURED_URL = "https://app.example.test"

const ENV_KEYS = ["NEXTAUTH_URL", "AUTH_TRUST_HOST", "VERCEL"] as const

describe("detectOrigin", () => {
  const saved: Record<string, string | undefined> = {}

  beforeEach(() => {
    for (const key of ENV_KEYS) {
      saved[key] = process.env[key]
      delete process.env[key]
    }
  })

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (saved[key] === undefined) delete process.env[key]
      else process.env[key] = saved[key]
    }
  })

  it("prefers NEXTAUTH_URL over the forwarded host when AUTH_TRUST_HOST is set", () => {
    process.env.AUTH_TRUST_HOST = "true"
    process.env.NEXTAUTH_URL = CONFIGURED_URL

    expect(detectOrigin(FORWARDED_HOST, "https")).toBe(CONFIGURED_URL)
  })

  it("prefers NEXTAUTH_URL over the forwarded host on Vercel", () => {
    process.env.VERCEL = "1"
    process.env.NEXTAUTH_URL = CONFIGURED_URL

    expect(detectOrigin(FORWARDED_HOST, "https")).toBe(CONFIGURED_URL)
  })

  it("derives the origin from the forwarded host in trusted-host mode when NEXTAUTH_URL is not set", () => {
    process.env.AUTH_TRUST_HOST = "true"

    expect(detectOrigin("app.example.test", "https")).toBe(
      "https://app.example.test"
    )
  })

  it("returns NEXTAUTH_URL when not in trusted-host mode", () => {
    process.env.NEXTAUTH_URL = CONFIGURED_URL

    expect(detectOrigin(FORWARDED_HOST, "https")).toBe(CONFIGURED_URL)
  })

  it("returns undefined when neither trusted-host mode nor NEXTAUTH_URL is configured", () => {
    expect(detectOrigin(FORWARDED_HOST, "https")).toBeUndefined()
  })
})
