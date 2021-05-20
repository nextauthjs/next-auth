import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/react"
import { server } from "./mocks"
import { signIn } from ".."

const { location } = window

beforeAll(() => {
  server.listen()
  delete window.location
  window.location = {
    ...location,
    replace: jest.fn(),
  }
})

beforeEach(() => {
  server.resetHandlers()
  jest.resetAllMocks()
})

afterAll(() => {
  window.location = location
  server.close()
})

test("if no provider, it redirects to the default sign-in page", async () => {
  render(<SignInFlow />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(window.location.replace).toBeCalledWith(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.href)}`
    )
  })
})

test("if unknown provider, it redirects to the default sign-in page", async () => {
  const callbackUrl = "https://redirects/to"

  render(<SignInFlow providerId="foo" callbackUrl={callbackUrl} />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(window.location.replace).toBeCalledWith(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
    )
  })
})

function SignInFlow({ providerId, callbackUrl }) {
  return (
    <button onClick={() => signIn(providerId, { callbackUrl })}>Sign in</button>
  )
}
