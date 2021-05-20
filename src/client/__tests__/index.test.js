import { render, screen, waitFor } from "@testing-library/react"
import { rest } from "msw"
import { server, mockSession } from "./mocks"
import logger from "../../lib/logger"
import { useState, useEffect } from "react"
import { getSession } from ".."

jest.mock("../../lib/logger", () => ({
  __esModule: true,
  default: {
    warn: jest.fn(),
    debug: jest.fn(),
    error: jest.fn(),
  },
  proxyLogger(logger) {
    return logger
  },
}))

beforeAll(() => server.listen())

beforeEach(() => {
  // eslint-disable-next-line no-proto
  jest.spyOn(window.localStorage.__proto__, "setItem")
})

afterEach(() => {
  server.resetHandlers()
  jest.restoreAllMocks()
})

afterAll(() => server.close())

test("getSession()", async () => {
  render(<SessionPage />)

  // In the start, there is no session
  const noSession = await screen.findByText("No session")
  expect(noSession).toBeInTheDocument()

  // After we fetched the session, it should be rendered
  const session = await screen.findByText(new RegExp(mockSession.user.name))
  expect(session).toBeInTheDocument()

  const localStorageCalls = localStorage.setItem.mock.calls.filter(
    (call) => call[0] !== "MSW_COOKIE_STORE"
  )

  // The session should be stored in local storage
  expect(localStorageCalls).toHaveLength(1)
  expect(localStorageCalls[0][0]).toBe("nextauth.message")
  expect(JSON.parse(localStorageCalls[0][1])).toEqual(
    expect.objectContaining({
      event: "session",
      data: { trigger: "getSession" },
    })
  )

  // Re-render, simulating fetching session fail
  server.use(
    rest.get("/api/auth/session", (req, res, ctx) => {
      return res(ctx.status(500), ctx.body("Server error"))
    })
  )
  render(<SessionPage />)

  // If fetching the session failed, we should log it
  await waitFor(() => {
    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(logger.error).toBeCalledWith(
      "CLIENT_FETCH_ERROR",
      "session",
      new SyntaxError("Unexpected token S in JSON at position 0")
    )
  })
})

function SessionPage() {
  const [session, setSession] = useState(null)
  useEffect(() => {
    async function fetchUserSession() {
      try {
        const result = await getSession({})
        setSession(result)
      } catch (e) {
        console.error(e)
      }
    }
    fetchUserSession()
  }, [])

  if (session) {
    return <pre>{JSON.stringify(session, null, 2)}</pre>
  }
  return <p>No session</p>
}
