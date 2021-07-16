import { rest } from "msw"
import { renderHook } from "@testing-library/react-hooks"
import { render, waitFor } from "@testing-library/react"
import { SessionProvider, useSession } from "../react"
import { server, mockSession } from "./helpers/mocks"

// const fetchSpy = jest.spyOn(global, "fetch")

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})

test("it won't allow to fetch the session in isolation without a session context", () => {
  function App() {
    useSession()
    return null
  }

  expect(() => render(<App />)).toThrow(
    "[next-auth]: `useSession` must be wrapped in a <SessionProvider />"
  )
})

test("when fetching the session, there won't be `data` and `status` will be 'loading'", () => {
  const { result } = renderHook(() => useSession(), {
    wrapper: SessionProvider,
  })

  expect(result.current.data).toBe(undefined)
  expect(result.current.status).toBe("loading")
})

test("when session is fetched, `data` will contain the session data and `status` will be 'authenticated'", async () => {
  const { result } = renderHook(() => useSession(), {
    wrapper: SessionProvider,
  })

  return waitFor(() => {
    expect(result.current.data).toEqual(mockSession)
    expect(result.current.status).toBe("authenticated")
  })
})

// TODO: Need to clear the session cache for this to work...
test.skip("when it fails to fetch the session, `data` will be null and `status` will be 'unauthenticated'", async () => {
  server.use(
    rest.get(`/api/auth/session`, (req, res, ctx) =>
      res(ctx.status(404), ctx.json(null))
    )
  )

  const { result } = renderHook(() => useSession(), {
    wrapper: SessionProvider,
  })

  return waitFor(() => {
    expect(result.current.data).toEqual(mockSession)
    expect(result.current.status).toBe("authenticated")
  })
})

test.todo("it'll redirect to sign-in page if the user is not authenticated")

test.todo(
  "will notify when the user is re-directed to sign-in because of an expired session"
)
