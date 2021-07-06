import parseUrl from "../../lib/parse-url"

// https://stackoverflow.com/questions/48033841/test-process-env-with-jest
describe("parseUrl() tests", () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test("when on client side and NEXT_PUBLIC_NEXTAUTH_URL is defined, correctly returns baseUrl and basePath", () => {
    process.env.NEXT_PUBLIC_NEXTAUTH_URL = "http://localhost:3000/api/v1/auth"

    const { baseUrl, basePath } = parseUrl()

    expect(baseUrl).toBe("http://localhost:3000")
    expect(basePath).toBe("/api/v1/auth")
  })

  test("when on client side and NEXT_PUBLIC_NEXTAUTH_URL is not defined, falls back to default values", () => {
    const { baseUrl, basePath } = parseUrl()

    expect(baseUrl).toBe("http://localhost:3000")
    expect(basePath).toBe("/api/auth")
  })

  test("when on server side, correctly parses any given URL", () => {
    let url = "http://localhost:3000"
    let { baseUrl, basePath } = parseUrl(url)

    expect(baseUrl).toBe("http://localhost:3000")
    expect(basePath).toBe("/api/auth")

    url = "http://localhost:3000/api/v1/authentication/"
    // this semi-colon is needed, otherwise js thinks the string
    // above is a function
    ;({ baseUrl, basePath } = parseUrl(url))

    expect(baseUrl).toBe("http://localhost:3000")
    expect(basePath).toBe("/api/v1/authentication")

    url = "https://www.mydomain.com"
    ;({ baseUrl, basePath } = parseUrl(url))

    expect(baseUrl).toBe("https://www.mydomain.com")
    expect(basePath).toBe("/api/auth")

    url = "https://www.mydomain.com/api/v3/auth"
    ;({ baseUrl, basePath } = parseUrl(url))

    expect(baseUrl).toBe("https://www.mydomain.com")
    expect(basePath).toBe("/api/v3/auth")
  })
})
