import * as core from "../src/core"
import { MissingSecret } from "../src/core/errors"
import { getServerSession } from "../src/next"
import { mockLogger } from "./lib"

// `AuthHandler` is compiled to a non-configurable CommonJS export, so it cannot
// be replaced with `jest.spyOn`. Mock the module instead, defaulting to the
// real implementation so unrelated tests in this file are unaffected.
jest.mock("../src/core", () => {
  const actual = jest.requireActual("../src/core")
  return {
    __esModule: true,
    ...actual,
    AuthHandler: jest.fn(actual.AuthHandler),
  }
})

const originalWarn = console.warn
let logger = mockLogger()

const req: any = { headers: {} }
const res: any = { setHeader: jest.fn(), getHeader: jest.fn() }

beforeEach(() => {
  // @ts-expect-error
  process.env.NODE_ENV = "production"
  process.env.NEXTAUTH_URL = "http://localhost"
  console.warn = jest.fn()
})

afterEach(() => {
  logger = mockLogger()
  // @ts-expect-error
  process.env.NODE_ENV = "test"
  delete process.env.NEXTAUTH_URL
  console.warn = originalWarn
})

describe("Treat secret correctly", () => {
  it("Read from NEXTAUTH_SECRET", async () => {
    process.env.NEXTAUTH_SECRET = "secret"
    await getServerSession(req, res, { providers: [], logger })

    expect(logger.error).toBeCalledTimes(0)
    expect(logger.error).not.toBeCalledWith("NO_SECRET")

    delete process.env.NEXTAUTH_SECRET
  })

  it("Read from options.secret", async () => {
    await getServerSession(req, res, {
      providers: [],
      logger,
      secret: "secret",
    })

    expect(logger.error).toBeCalledTimes(0)
    expect(logger.error).not.toBeCalledWith("NO_SECRET")
  })

  it("Error if missing NEXTAUTH_SECRET and secret", async () => {
    const configError = new Error(
      "There is a problem with the server configuration. Check the server logs for more information."
    )
    await expect(
      getServerSession(req, res, { providers: [], logger })
    ).rejects.toThrowError(configError)

    expect(logger.error).toBeCalledTimes(1)
    expect(logger.error).toBeCalledWith("NO_SECRET", expect.any(MissingSecret))
  })
})

describe("Return correct data", () => {
  afterEach(() => {
    const actual = jest.requireActual("../src/core")
    ;(core.AuthHandler as jest.Mock).mockImplementation(actual.AuthHandler)
  })

  it("Should return null if there is no session", async () => {
    // @ts-expect-error
    ;(core.AuthHandler as jest.Mock).mockReturnValue({ body: {} })

    const session = await getServerSession(req, res, {
      providers: [],
      logger,
      secret: "secret",
    })

    expect(session).toEqual(null)
  })

  it("Should return the session if one is found", async () => {
    const mockedResponse = {
      body: {
        user: {
          name: "John Doe",
          email: "test@example.com",
          image: "",
          id: "1234",
        },
        expires: "",
      },
    }

    // @ts-expect-error
    ;(core.AuthHandler as jest.Mock).mockReturnValue(mockedResponse)

    const session = await getServerSession(req, res, {
      providers: [],
      logger,
      secret: "secret",
    })

    expect(session).toEqual(mockedResponse.body)
  })
})
