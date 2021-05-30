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
      expect(window.location.replace).toHaveBeenCalledTimes(1)
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
      expect(window.location.replace).toHaveBeenCalledTimes(1)
      expect(window.location.replace).toHaveBeenCalledWith(
        `/api/auth/signin?callbackUrl=${encodeURIComponent(
          window.location.href
        )}`
      )
    })
  }
)

test.each`
  provider         | mockUrl
  ${`email`}       | ${mockEmailResponse.url}
  ${`credentials`} | ${mockCredentialsResponse.url}
`(
  "$provider provider redirects if `redirect` is `true`",
  async ({ provider, mockUrl }) => {
    render(<SignInFlow providerId={provider} redirect={true} />)

    userEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(window.location.replace).toHaveBeenCalledTimes(1)
      expect(window.location.replace).toHaveBeenCalledWith(mockUrl)
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

  await waitFor(() => {
    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith(mockGithubResponse.url)
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

  await waitFor(() => {
    expect(window.location.replace).not.toHaveBeenCalledWith(
      mockCredentialsResponse.url
    )

    expect(screen.getByTestId("signin-result").textContent).not.toBe(
      "no response"
    )
  })

  // snapshot the expected return shape from `signIn`
  expect(JSON.parse(screen.getByTestId("signin-result").textContent))
    .toMatchInlineSnapshot(`
    Object {
      "error": null,
      "ok": true,
      "status": 200,
      "url": "https://path/to/credentials/url",
    }
  `)
})

test("redirection can be stopped using the 'email' provider", async () => {
  render(
    <SignInFlow providerId="email" callbackUrl={callbackUrl} redirect={false} />
  )

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(window.location.replace).not.toHaveBeenCalledWith(
      mockEmailResponse.url
    )

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
      "url": "https://path/to/email/url",
    }
  `)
})

test("if callback URL contains a hash we force a window reload when re-directing", async () => {
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

  render(<SignInFlow providerId="email" callbackUrl={mockUrlWithHash} />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(window.location.replace).toHaveBeenCalledTimes(1)
    expect(window.location.replace).toHaveBeenCalledWith(mockUrlWithHash)
    // the browser when reload the page if the redirect URL contains a hash, hence the client force it, see #1289
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})

function SignInFlow({ providerId, callbackUrl, redirect = true }) {
  const [response, setResponse] = useState(null)

  async function handleSignIn() {
    const result = await signIn(providerId, { callbackUrl, redirect })
    setResponse(result)
  }

  return (
    <>
      <p data-testid="signin-result">
        {response ? JSON.stringify(response) : "no response"}
      </p>
      <button onClick={() => handleSignIn()}>Sign in</button>
    </>
  )
}
