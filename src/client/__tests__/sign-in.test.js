import { useState } from "react"
import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/react"
import { server, mockCredentialsResponse, mockEmailResponse } from "./mocks"
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
  jest.resetAllMocks()
  server.resetHandlers()
})

afterAll(() => {
  window.location = location
  server.close()
})

const callbackUrl = "https://redirects/to"

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
  render(<SignInFlow providerId="foo" callbackUrl={callbackUrl} />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(window.location.replace).toBeCalledWith(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
    )
  })
})

test("redirection can be stopped using the 'credentials' provider", async () => {
  render(
    <SignInFlow
      providerId="credentials"
      callbackUrl={callbackUrl}
      redirect={false}
    />
  )

  userEvent.click(screen.getByRole("button"))

  // it's a known provider don't redirect back to sign-in page
  await waitFor(() => {
    expect(window.location.replace).not.toHaveBeenCalledWith(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
    )
  })

  // if all went well, expect the user to be redirected to the provider post signin URL
  await waitFor(() => {
    expect(window.location.replace).toHaveBeenCalledWith(
      mockCredentialsResponse.url
    )
  })

  // `signIn()` should have not returned anything...
  expect(screen.getByTestId("signin-result").textContent).toBe(
    JSON.stringify("no-response")
  )
})

test("redirection can be stopped using the 'email' provider", async () => {
  render(
    <SignInFlow providerId="email" callbackUrl={callbackUrl} redirect={false} />
  )

  userEvent.click(screen.getByRole("button"))

  // it's a known provider don't redirect back to sign-in page
  await waitFor(() => {
    expect(window.location.replace).not.toHaveBeenCalledWith(
      `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
    )
  })

  // if all went well, expect the user to be redirected to the provider post signin URL
  await waitFor(() => {
    expect(window.location.replace).toHaveBeenCalledWith(mockEmailResponse.url)
  })

  // `signIn()` should have not returned anything...
  expect(screen.getByTestId("signin-result").textContent).toBe(
    JSON.stringify("no-response")
  )
})

function SignInFlow({ providerId, callbackUrl, redirect = true }) {
  const [response, setResponse] = useState(null)

  async function setSignInRes() {
    const result = await signIn(providerId, { callbackUrl, redirect })
    setResponse(result || "no-response")
  }

  return (
    <>
      <p data-testid="signin-result">{JSON.stringify(response)}</p>
      <button onClick={() => setSignInRes()}>Sign in</button>
    </>
  )
}
