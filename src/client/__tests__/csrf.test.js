import { useState } from "react"
import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/react"
import { server, mockCSRFToken } from "./helpers/mocks"
import logger from "../../lib/logger"
import { getCsrfToken } from "../react"
import { rest } from "msw"

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

beforeAll(() => {
  server.listen()
})

afterEach(() => {
  server.resetHandlers()
  jest.clearAllMocks()
})

afterAll(() => {
  server.close()
})

test("returns the Cross Site Request Forgery Token (CSRF Token) required to make POST requests", async () => {
  render(<CSRFFlow />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(screen.getByTestId("csrf-result").textContent).toEqual(
      mockCSRFToken.csrfToken
    )
  })
})

test("when there's no CSRF token returned, it'll reflect that", async () => {
  server.use(
    rest.get("/api/auth/csrf", (req, res, ctx) =>
      res(
        ctx.status(200),
        ctx.json({
          ...mockCSRFToken,
          csrfToken: null,
        })
      )
    )
  )

  render(<CSRFFlow />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(screen.getByTestId("csrf-result").textContent).toBe("null-response")
  })
})

test("when the fetch fails it'll throw a client fetch error", async () => {
  server.use(
    rest.get("/api/auth/csrf", (req, res, ctx) =>
      res(ctx.status(500), ctx.text("some error happened"))
    )
  )

  render(<CSRFFlow />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(logger.error).toBeCalledWith(
      "CLIENT_FETCH_ERROR",
      "csrf",
      new SyntaxError("Unexpected token s in JSON at position 0")
    )
  })
})

function CSRFFlow() {
  const [response, setResponse] = useState()

  async function handleCSRF() {
    const result = await getCsrfToken()
    setResponse(result)
  }

  return (
    <>
      <p data-testid="csrf-result">
        {response === null ? "null-response" : response || "no response"}
      </p>
      <button onClick={handleCSRF}>Get CSRF</button>
    </>
  )
}
