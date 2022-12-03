import * as core from "../src/core"
import { MissingSecret } from "../src/core/errors"
import { unstable_getServerSession } from "../src/next"
import { mockLogger } from "./utils"

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
    await unstable_getServerSession(req, res, { providers: [], logger })

    expect(logger.error).toBeCalledTimes(0)
    expect(logger.error).not.toBeCalledWith("NO_SECRET")

    delete process.env.NEXTAUTH_SECRET
  })

  it("Read from options.secret", async () => {
    await unstable_getServerSession(req, res, {
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
      unstable_getServerSession(req, res, { providers: [], logger })
    ).rejects.toThrowError(configError)

    expect(logger.error).toBeCalledTimes(1)
    expect(logger.error).toBeCalledWith("NO_SECRET", expect.any(MissingSecret))
  })

  it("Only logs warning once and in development", async () => {
    process.env.NEXTAUTH_SECRET = "secret"
    // Expect console.warn to NOT be called due to NODE_ENV=production
    await unstable_getServerSession(req, res, { providers: [], logger })
    expect(console.warn).toBeCalledTimes(0)

    // Expect console.warn to be called ONCE due to NODE_ENV=development
    // @ts-expect-error
    process.env.NODE_ENV = "development"
    await unstable_getServerSession(req, res, { providers: [], logger })
    expect(console.warn).toBeCalledTimes(1)

    // Expect console.warn to be still only be called ONCE
    await unstable_getServerSession(req, res, { providers: [], logger })
    expect(console.warn).toBeCalledTimes(1)
    delete process.env.NEXTAUTH_SECRET
  })
})

describe("Return correct data", () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it("Should return null if there is no session", async () => {
    const spy = jest.spyOn(core, "AuthHandler")
    // @ts-expect-error [Response.json](https://developer.mozilla.org/en-US/docs/Web/API/Response/json)
    spy.mockReturnValue(Promise.resolve(Response.json(null)))

    const session = await unstable_getServerSession(req, res, {
      providers: [],
      logger,
      secret: "secret",
    })

    expect(session).toEqual(null)
  })

  it("Should return the session if one is found", async () => {
    const mockedBody = {
      user: {
        name: "John Doe",
        email: "test@example.com",
        image: "",
        id: "1234",
      },
      expires: "",
    }

    const spy = jest.spyOn(core, "AuthHandler")
    // @ts-expect-error [Response.json](https://developer.mozilla.org/en-US/docs/Web/API/Response/json)
    spy.mockReturnValue(Promise.resolve(Response.json(mockedBody)))

    const session = await unstable_getServerSession(req, res, {
      providers: [],
      logger,
      secret: "secret",
    })

    expect(session).toEqual(mockedBody)
  })
})
