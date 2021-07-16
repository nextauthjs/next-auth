import { render, screen, waitFor } from "@testing-library/react"
import { server, mockSession } from "./helpers/mocks"
import { printFetchCalls } from "./helpers/utils"
import { SessionProvider, useSession, signOut } from "../react"

const origDocumentVisibility = document.visibilityState
const fetchSpy = jest.spyOn(global, "fetch")

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  changeTabVisibility(origDocumentVisibility)
})

afterAll(() => {
  server.close()
})

test("it won't allow to fetch the session in isolation without a session context", () => {
  function App() {
    useSession()
    return null
  }

  jest.spyOn(console, "error")
  console.error.mockImplementation(() => {})

  expect(() => render(<App />)).toThrow(
    "useSession must be wrapped in a SessionProvider"
  )

  console.error.mockRestore()
})

test("fetches the session once and re-uses it for different consumers", async () => {
  fetchSpy.mockClear()

  render(<ProviderFlow />)

  expect(screen.getByTestId("session-consumer-1")).toHaveTextContent("loading")
  expect(screen.getByTestId("session-consumer-2")).toHaveTextContent("loading")

  await waitFor(() => {
    expect(fetchSpy).toHaveBeenCalledTimes(1)

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/auth/session",
      expect.anything()
    )

    const session1 = screen.getByTestId("session-consumer-1").textContent
    const session2 = screen.getByTestId("session-consumer-2").textContent

    expect(session1).toEqual(session2)
  })
})

test("when there's an existing session, it won't initialize as loading", async () => {
  fetchSpy.mockClear()

  /**
   * TODO: How can we force a clean session state between tests? At the moment
   *       the library uses this internal constant: __NEXTAUTH to track calls
   *       and we can't clean it between tests.
   */
  render(<ProviderFlow session={mockSession} />)

  expect(fetchSpy).not.toHaveBeenCalled()
})

test("will refetch the session when the browser tab becomes active again", async () => {
  fetchSpy.mockClear()

  render(<ProviderFlow session={mockSession} />)

  expect(fetchSpy).not.toHaveBeenCalled()

  // Hide the current tab
  changeTabVisibility("hidden")

  // Given the current tab got hidden, it should not attempt to re-fetch the session
  expect(fetchSpy).not.toHaveBeenCalled()

  // Make the tab again visible
  changeTabVisibility("visible")

  // Given the user made the tab visible again, now attempts to sync and re-fetch the session
  await waitFor(() => {
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/auth/session",
      expect.anything()
    )
  })
})

test("will refetch the session if told to do so programmatically from another window", async () => {
  fetchSpy.mockClear()

  render(<ProviderFlow session={mockSession} />)

  expect(fetchSpy).not.toHaveBeenCalled()

  // Hide the current tab
  changeTabVisibility("hidden")

  // Given the current tab got hidden, it should not attempt to re-fetch the session
  expect(fetchSpy).not.toHaveBeenCalled()

  // simulate sign-out triggered by another tab
  signOut({ redirect: false })

  // Given signed out in another tab, it attempts to sync and re-fetch the session
  await waitFor(() => {
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/auth/session",
      expect.anything()
    )

    // We should have a call to sign-out and a call to refetch the session accordingly
    // TODO: investigate why the CSRF endpoint is called.
    expect(printFetchCalls(fetchSpy.mock.calls)).toMatchInlineSnapshot(`
      Array [
        "GET /api/auth/csrf",
        "POST /api/auth/signout",
        "GET /api/auth/session",
      ]
    `)
  })
})

test.todo(
  "allows to customize how often the session will be re-fetched through polling"
)

test.todo("allows to customize the URL for session fetching")

test.todo("allows to customize session stale time")

function ProviderFlow(props) {
  return (
    <SessionProvider {...props}>
      <SessionConsumer />
      <SessionConsumer testId="2" />
    </SessionProvider>
  )
}

function SessionConsumer({ testId = 1 }) {
  const { data: session, status } = useSession()

  return (
    <div data-testid={`session-consumer-${testId}`}>
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
