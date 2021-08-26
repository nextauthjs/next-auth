import { rest } from "msw"
import { renderHook } from "@testing-library/react-hooks"
import { render, waitFor } from "@testing-library/react"
import { SessionProvider, useSession, signOut } from "../react"
import { server, mockSession } from "./helpers/mocks"

const origConsoleError = console.error
const origLocation = window.location
const locationReplace = jest.fn()

beforeAll(() => {
  // Prevent noise on the terminal... `next-auth` will log to `console.error`
  // every time a request fails, which makes the tests output very noisy...
  console.error = jest.fn()

  // Allows to spy on `window.location.replace`...
  delete window.location
  window.location = { ...origLocation, replace: locationReplace }

  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  locationReplace.mockClear()

  // clear the internal session cache...
  signOut({ redirect: false })
})

afterAll(() => {
  console.error = origConsoleError
  window.location = origLocation
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

  await waitFor(() => {
    expect(result.current.data).toEqual(mockSession)
    expect(result.current.status).toBe("authenticated")
  })
})

test("when it fails to fetch the session, `data` will be null and `status` will be 'unauthenticated'", async () => {
  server.use(
    rest.get(`/api/auth/session`, (req, res, ctx) =>
      res(ctx.status(401), ctx.json({}))
    )
  )

  const { result } = renderHook(() => useSession(), {
    wrapper: SessionProvider,
  })

  return waitFor(() => {
    expect(result.current.data).toEqual(null)
    expect(result.current.status).toBe("unauthenticated")
  })
})

test("it'll redirect to sign-in page if the session is required and the user is not authenticated", async () => {
  server.use(
    rest.get(`/api/auth/session`, (req, res, ctx) =>
      res(ctx.status(401), ctx.json({}))
    )
  )

  const { result } = renderHook(() => useSession({ required: true }), {
    wrapper: SessionProvider,
  })

  await waitFor(() => {
    expect(result.current.data).toEqual(null)
    expect(result.current.status).toBe("loading")
  })

  expect(locationReplace).toHaveBeenCalledTimes(1)

  expect(locationReplace).toHaveBeenCalledWith(
    expect.stringContaining("/api/auth/signin")
  )

  expect(locationReplace).toHaveBeenCalledWith(
    expect.stringContaining(
      new URLSearchParams({
        error: "SessionRequired",
        callbackUrl: window.location.href,
      }).toString()
    )
  )
})

test("will call custom redirect logic if supplied when the user could not authenticate", async () => {
  server.use(
    rest.get(`/api/auth/session`, (req, res, ctx) =>
      res(ctx.status(401), ctx.json({}))
    )
  )

  const customRedirect = jest.fn()

  const { result } = renderHook(
    () => useSession({ required: true, onUnauthenticated: customRedirect }),
    {
      wrapper: SessionProvider,
    }
  )

  await waitFor(() => {
    expect(result.current.data).toEqual(null)
    expect(result.current.status).toBe("loading")
  })

  // it shouldn't have tried to re-direct to sign-in page (default behavior)
  expect(locationReplace).not.toHaveBeenCalled()

  expect(customRedirect).toHaveBeenCalledTimes(1)
})
