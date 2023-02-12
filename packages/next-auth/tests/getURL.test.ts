import { getURL as getURLOriginal } from "../src/utils/node"

it("Should return error when missing url", () => {
  expect(getURL(undefined, {})).toEqual(new Error("Missing url"))
})

it("Should return error when missing host", () => {
  expect(getURL("/", {})).toEqual(new Error("Missing host"))
})

it("Should return error when invalid protocol", () => {
  expect(
    getURL("/", { host: "localhost", "x-forwarded-proto": "file" })
  ).toEqual(new Error("Invalid protocol"))
})

it("Should return error when invalid host", () => {
  expect(getURL("/", { host: "/" })).toEqual(
    new TypeError("Invalid base URL: http:///")
  )
})

it("Should read host headers", () => {
  expect(getURL("/api/auth/session", { host: "localhost" })).toBeURL(
    "http://localhost/api/auth/session"
  )

  expect(
    getURL("/custom/api/auth/session", { "x-forwarded-host": "localhost:3000" })
  ).toBeURL("http://localhost:3000/custom/api/auth/session")

  // Prefer x-forwarded-host over host
  expect(
    getURL("/", { host: "localhost", "x-forwarded-host": "localhost:3000" })
  ).toBeURL("http://localhost:3000/")
})

it("Should read protocol headers", () => {
  expect(
    getURL("/", { host: "localhost", "x-forwarded-proto": "http" })
  ).toBeURL("http://localhost/")
})

describe("process.env.NEXTAUTH_URL", () => {
  afterEach(() => delete process.env.NEXTAUTH_URL)

  it("Should prefer over headers if present", () => {
    process.env.NEXTAUTH_URL = "http://localhost:3000"
    expect(getURL("/api/auth/session", { host: "localhost" })).toBeURL(
      "http://localhost:3000/api/auth/session"
    )
  })

  it("catch errors", () => {
    process.env.NEXTAUTH_URL = "invald-url"
    expect(getURL("/api/auth/session", {})).toEqual(
      new TypeError("Invalid URL: invald-url")
    )

    process.env.NEXTAUTH_URL = "file://localhost"
    expect(getURL("/api/auth/session", {})).toEqual(
      new TypeError("Invalid protocol")
    )
  })

  it("Supports custom base path", () => {
    process.env.NEXTAUTH_URL = "http://localhost:3000/custom/api/auth"
    expect(getURL("/api/auth/session", {})).toBeURL(
      "http://localhost:3000/custom/api/auth/session"
    )

    // With trailing slash
    process.env.NEXTAUTH_URL = "http://localhost:3000/custom/api/auth/"
    expect(getURL("/api/auth/session", {})).toBeURL(
      "http://localhost:3000/custom/api/auth/session"
    )

    // Multiple custom segments
    process.env.NEXTAUTH_URL = "http://localhost:3000/custom/path/api/auth"
    expect(getURL("/api/auth/session", {})).toBeURL(
      "http://localhost:3000/custom/path/api/auth/session"
    )

    process.env.NEXTAUTH_URL = "http://localhost:3000/custom/path/api/auth/"
    expect(getURL("/api/auth/session", {})).toBeURL(
      "http://localhost:3000/custom/path/api/auth/session"
    )

    // No /api/auth
    process.env.NEXTAUTH_URL = "http://localhost:3000/custom/nextauth"
    expect(getURL("/session", {})).toBeURL(
      "http://localhost:3000/custom/nextauth/session"
    )

    // No /api/auth, with trailing slash
    process.env.NEXTAUTH_URL = "http://localhost:3000/custom/nextauth/"
    expect(getURL("/session", {})).toBeURL(
      "http://localhost:3000/custom/nextauth/session"
    )
  })
})

// Utils

function getURL(
  url: Parameters<typeof getURLOriginal>[0],
  headers: HeadersInit
) {
  return getURLOriginal(url, new Headers(headers))
}

expect.extend({
  toBeURL(rec, exp) {
    const r = rec.toString()
    const e = exp.toString()
    const printR = this.utils.printReceived
    const printE = this.utils.printExpected
    if (r === e) {
      return {
        message: () => `expected ${printE(e)} not to be ${printR(r)}`,
        pass: true,
      }
    }
    return {
      message: () => `expected ${printE(e)}, got ${printR(r)}`,
      pass: false,
    }
  },
})

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeURL: (expected: string) => R
    }
  }
}
