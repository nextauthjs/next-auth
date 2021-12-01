import { rest } from "msw"
import { render, screen, waitFor } from "@testing-library/react"
import { server, mockSession } from "./helpers/mocks"
import { printFetchCalls } from "./helpers/utils"
import { SessionProvider, useSession, signOut, getSession } from "../../react"

const origDocumentVisibility = document.visibilityState
const fetchSpy = jest.spyOn(global, "fetch")

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  changeTabVisibility(origDocumentVisibility)
  fetchSpy.mockClear()
})

afterAll(() => {
  server.close()
})

test("fetches the session once and re-uses it for different consumers", async () => {
  render(<ProviderFlow />)

  expect(screen.getByTestId("session-1")).toHaveTextContent("loading")
  expect(screen.getByTestId("session-2")).toHaveTextContent("loading")

  return waitFor(() => {
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/auth/session",
      expect.anything()
    )

    const session1 = screen.getByTestId("session-1").textContent
    const session2 = screen.getByTestId("session-2").textContent

    expect(session1).toEqual(session2)
  })
})

test("when there's an existing session, it won't try to fetch a new one straightaway", async () => {
  render(<ProviderFlow session={mockSession} />)

  expect(fetchSpy).not.toHaveBeenCalled()
})

test("will refetch the session when the browser tab becomes active again", async () => {
  render(<ProviderFlow session={mockSession} />)

  expect(fetchSpy).not.toHaveBeenCalled()

  // Hide the current tab
  changeTabVisibility("hidden")

  // Given the current tab got hidden, it should not attempt to re-fetch the session
  expect(fetchSpy).not.toHaveBeenCalled()

  // Make the tab again visible
  changeTabVisibility("visible")

  // Given the user made the tab visible again, now attempts to sync and re-fetch the session
  return waitFor(() => {
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/auth/session",
      expect.anything()
    )
  })
})

test("will refetch the session if told to do so programmatically from another window", async () => {
  render(<ProviderFlow session={mockSession} />)

  expect(fetchSpy).not.toHaveBeenCalled()

  // Hide the current tab
  changeTabVisibility("hidden")

  // Given the current tab got hidden, it should not attempt to re-fetch the session
  expect(fetchSpy).not.toHaveBeenCalled()

  // simulate sign-out triggered by another tab
  signOut({ redirect: false })

  // Given signed out in another tab, it attempts to sync and re-fetch the session
  return waitFor(() => {
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/auth/session",
      expect.anything()
    )

    // We should have a call to sign-out and a call to refetch the session accordingly
    expect(printFetchCalls(fetchSpy.mock.calls)).toMatchInlineSnapshot(`
      Array [
        "GET /api/auth/csrf",
        "POST /api/auth/signout",
        "GET /api/auth/session",
      ]
    `)
  })
})

test("allows to customize how often the session will be re-fetched through polling", () => {
  jest.useFakeTimers()

  render(<ProviderFlow session={mockSession} refetchInterval={1} />)

  // we provided a mock session so it shouldn't try to fetch a new one
  expect(fetchSpy).not.toHaveBeenCalled()

  jest.advanceTimersByTime(1000)

  expect(fetchSpy).toHaveBeenCalledTimes(1)
  expect(fetchSpy).toHaveBeenCalledWith("/api/auth/session", expect.anything())

  jest.advanceTimersByTime(1000)

  // it should have tried to refetch the session, hence counting 2 calls to the session endpoint
  expect(fetchSpy).toHaveBeenCalledTimes(2)
  expect(printFetchCalls(fetchSpy.mock.calls)).toMatchInlineSnapshot(`
      Array [
        "GET /api/auth/session",
        "GET /api/auth/session",
      ]
    `)
})

test("allows to customize the URL for session fetching", async () => {
  const myPath = "/api/v1/auth"

  server.use(
    rest.get(`${myPath}/session`, (req, res, ctx) =>
      res(ctx.status(200), ctx.json(mockSession))
    )
  )

  render(<ProviderFlow session={mockSession} basePath={myPath} />)

  // there's an existing session so it should not try to fetch a new one
  expect(fetchSpy).not.toHaveBeenCalled()

  // force a session refetch across all clients...
  getSession()

  return waitFor(() => {
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy).toHaveBeenCalledWith(
      `${myPath}/session`,
      expect.anything()
    )
  })
})

function ProviderFlow(props) {
  return (
    <SessionProvider {...props}>
      <SessionConsumer />
      <SessionConsumer testId="2" />
    </SessionProvider>
  )
}

function SessionConsumer({ testId = 1, ...rest }) {
  const { data: session, status } = useSession(rest)

  return (
    <div data-testid={`session-${testId}`}>
      {status === "loading" ? "loading" : JSON.stringify(session)}
    </div>
  )
}

function changeTabVisibility(status) {
  const visibleStates = ["visible", "hidden"]

  if (!visibleStates.includes(status)) return

  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    value: status,
  })

  document.dispatchEvent(new Event("visibilitychange"))
}
