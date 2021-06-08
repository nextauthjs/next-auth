import { useState } from "react"
import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/react"
import { server, mockProviders } from "./helpers/mocks"
import { getProviders } from ".."
import logger from "../../lib/logger"
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

test("when called it'll return the currently configured providers for sign in", async () => {
  render(<ProvidersFlow />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(screen.getByTestId("providers-result").textContent).toEqual(
      JSON.stringify(mockProviders)
    )
  })
})

test("when failing to fetch the providers, it'll log the error", async () => {
  server.use(
    rest.get("/api/auth/providers", (req, res, ctx) =>
      res(ctx.status(500), ctx.text("some error happened"))
    )
  )

  render(<ProvidersFlow />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(logger.error).toBeCalledWith(
      "CLIENT_FETCH_ERROR",
      "providers",
      new SyntaxError("Unexpected token s in JSON at position 0")
    )
  })
})

function ProvidersFlow() {
  const [response, setResponse] = useState()

  async function handleGerProviders() {
    const result = await getProviders()
    setResponse(result)
  }

  return (
    <>
      <p data-testid="providers-result">
        {response === null
          ? "null-response"
          : JSON.stringify(response) || "no response"}
      </p>
      <button onClick={handleGerProviders}>Get Providers</button>
    </>
  )
}
