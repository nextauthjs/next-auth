import { rest } from "msw"
import { renderHook } from "@testing-library/react-hooks"
import { render, waitFor } from "@testing-library/react"
import { SessionProvider, useSession, signOut } from "../../react"
import { server, mockSession } from "./helpers/mocks"

const origConsoleError = console.error
const { location } = window

let _href = window.location.href
beforeAll(() => {
  // Prevent noise on the terminal... `next-auth` will log to `console.error`
  // every time a request fails, which makes the tests output very noisy...
  console.error = jest.fn()

  // Allows to mutate `window.location`...
  delete window.location
  window.location = {}
  Object.defineProperty(window.location, "href", {
    get: () => _href,
    // whatwg-fetch or whatwg-url does not seem to work with relative URLs
    set: (href) => {
      _href = href.startsWith("/") ? `http://localhost${href}` : href
      return _href
    },
  })

  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  _href = "http://localhost/"

  // clear the internal session cache...
  signOut({ redirect: false })
})

afterAll(() => {
  console.error = origConsoleError
  window.location = location
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
    rest.get(`http://localhost/api/auth/session`, (_, res, ctx) =>
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
    rest.get(`http://localhost/api/auth/session`, (req, res, ctx) =>
      res(ctx.status(401), ctx.json({}))
    )
  )

  const callbackUrl = window.location.href
  const { result } = renderHook(() => useSession({ required: true }), {
    wrapper: SessionProvider,
  })

  await waitFor(() => {
    expect(result.current.data).toEqual(null)
    expect(result.current.status).toBe("loading")
  })

  expect(window.location.href).toBe(
    `http://localhost/api/auth/signin?${new URLSearchParams({
      error: "SessionRequired",
      callbackUrl,
    })}`
  )
})

test("will call custom redirect logic if supplied when the user could not authenticate", async () => {
  server.use(
    rest.get(`http://localhost/api/auth/session`, (_, res, ctx) =>
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

  expect(customRedirect).toHaveBeenCalledTimes(1)
})
