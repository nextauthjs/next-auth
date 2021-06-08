import { useState } from "react"
import { rest } from "msw"
import { render, screen, waitFor } from "@testing-library/react"
import { server, mockSession } from "./helpers/mocks"
import { Provider, useSession } from ".."
import userEvent from "@testing-library/user-event"

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

  await waitFor(() => {
    expect(sessionRouteCall).toHaveBeenCalledTimes(1)

    const session1 = screen.getByTestId("session-consumer-1").textContent
    const session2 = screen.getByTestId("session-consumer-2").textContent

    expect(session1).toEqual(session2)
  })
})

function ProviderFlow({ options = {} }) {
  return (
    <>
      <Provider options={options}>
        <SessionConsumer />
        <SessionConsumer testId="2" />
      </Provider>
    </>
  )
}

function SessionConsumer({ testId = 1 }) {
  const [session, loading] = useSession()

  if (loading) return <span>loading</span>

  return (
    <div data-testid={`session-consumer-${testId}`}>
      {JSON.stringify(session)}
    </div>
  )
}
