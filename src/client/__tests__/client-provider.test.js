import { rest } from "msw"
import { render, screen, waitFor } from "@testing-library/react"
import { server, mockSession } from "./helpers/mocks"
import { SessionProvider, useSession } from "../react"

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  jest.clearAllMocks()
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

test("fetches the session once and re-uses it for different consumers", async () => {
  const sessionRouteCall = jest.fn()

  server.use(
    rest.get("/api/auth/session", (req, res, ctx) => {
      sessionRouteCall()
      res(ctx.status(200), ctx.json(mockSession))
    })
  )

  render(<ProviderFlow />)
  expect(screen.getByTestId("session-consumer-1")).toHaveTextContent("loading")
  expect(screen.getByTestId("session-consumer-2")).toHaveTextContent("loading")

  await waitFor(() => {
    expect(sessionRouteCall).toHaveBeenCalledTimes(1)

    const session1 = screen.getByTestId("session-consumer-1").textContent
    const session2 = screen.getByTestId("session-consumer-2").textContent

    expect(session1).toEqual(session2)
  })
})

test("initialize provider with session", () => {
  render(<ProviderFlow session={mockSession} />)

  expect(screen.getByTestId("session-consumer-1")).not.toHaveTextContent(
    "loading"
  )
  expect(screen.getByTestId("session-consumer-2")).not.toHaveTextContent(
    "loading"
  )
})

function ProviderFlow({ options = {} }) {
  return (
    <>
      <SessionProvider {...options}>
        <SessionConsumer />
        <SessionConsumer testId="2" />
      </SessionProvider>
    </>
  )
}

function SessionConsumer({ testId = 1 }) {
  const [session, loading] = useSession()

  if (loading)
    return <span data-testid={`session-consumer-${testId}`}>loading</span>

  return (
    <div data-testid={`session-consumer-${testId}`}>
      {JSON.stringify(session)}
    </div>
  )
}
