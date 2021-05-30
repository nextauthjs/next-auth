import { useState } from "react"
import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/react"
import {
  server,
  mockCredentialsResponse,
  mockEmailResponse,
  mockGithubResponse,
} from "./mocks"
import { signIn } from ".."
import { rest } from "msw"

const { location } = window

beforeAll(() => {
  server.listen()
  delete window.location
  window.location = {
    ...location,
    replace: jest.fn(),
    reload: jest.fn(),
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

test.each`
  provider | type
  ${""}    | ${"no"}
  ${"foo"} | ${"unknown"}
`(
  "if $type provider, it redirects to the default sign-in page",
  async ({ provider }) => {
    render(<SignInFlow providerId={provider} callbackUrl={callbackUrl} />)

    userEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith(
        `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`
      )
    })
  }
)

test.each`
  provider | type
  ${""}    | ${"no"}
  ${"foo"} | ${"unknown"}
`(
  "if $type provider supplied and no callback URL, redirects using the current location",
  async ({ provider }) => {
    render(<SignInFlow providerId={provider} />)

    userEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledWith(
        `/api/auth/signin?callbackUrl=${encodeURIComponent(
          window.location.href
        )}`
      )
    })
  }
)

test("redirection can't be stopped using an oauth provider", async () => {
  render(
    <SignInFlow
      providerId="github"
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

  await waitFor(() => {
    // we shouldn't have redirected to the provider post signin URL
    expect(window.location.replace).not.toHaveBeenCalledWith(
      mockGithubResponse.url
    )

    // `signIn()` should have returned the XHR response...
    expect(screen.getByTestId("signin-result").textContent).not.toBe(
      "no response"
    )
  })

  // snapshot the expected return shape from `signIn` oauth
  expect(JSON.parse(screen.getByTestId("signin-result").textContent))
    .toMatchInlineSnapshot(`
    Object {
      "error": null,
      "ok": true,
      "status": 200,
      "url": "https://path/to/github/url",
    }
  `)
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

  // if all went well, expect the user to be redirected to the provider post signin URL
  await waitFor(() => {
    expect(window.location.replace).toHaveBeenCalledWith(
      mockCredentialsResponse.url
    )
  })

  // `signIn()` should have not returned anything...
  expect(screen.getByTestId("signin-result").textContent).toBe("no response")
})

test("redirection can be stopped using the 'email' provider", async () => {
  render(
    <SignInFlow providerId="email" callbackUrl={callbackUrl} redirect={false} />
  )

  userEvent.click(screen.getByRole("button"))

  // if all went well, expect the user to be redirected to the provider post signin URL
  await waitFor(() => {
    expect(window.location.replace).toHaveBeenCalledWith(mockEmailResponse.url)
  })

  // `signIn()` should have not returned anything...
  expect(screen.getByTestId("signin-result").textContent).toBe("no response")
})

test("if url contains a hash when stopping redirection a page reload happens", async () => {
  const mockUrlWithHash = "https://path/to/email/url#foo-bar-baz"
  server.use(
    rest.post("/api/auth/signin/email", (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          ...mockEmailResponse,
          url: mockUrlWithHash,
        })
      )
    })
  )

  render(
    <SignInFlow providerId="email" callbackUrl={callbackUrl} redirect={false} />
  )

  userEvent.click(screen.getByRole("button"))

  // if all went well, expect the user to be redirected to the provider post signin URL
  await waitFor(() => {
    expect(window.location.replace).toHaveBeenCalledWith(mockUrlWithHash)
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})

function SignInFlow({ providerId, callbackUrl, redirect = true }) {
  const [response, setResponse] = useState(null)

  async function setSignInRes() {
    const result = await signIn(providerId, { callbackUrl, redirect })
    setResponse(result)
  }

  return (
    <>
      <p data-testid="signin-result">
        {response ? JSON.stringify(response) : "no response"}
      </p>
      <button onClick={() => setSignInRes()}>Sign in</button>
    </>
  )
}
