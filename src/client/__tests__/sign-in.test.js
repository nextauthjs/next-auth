import { useState } from "react"
import userEvent from "@testing-library/user-event"
import { render, screen, waitFor } from "@testing-library/react"
import logger from "../../lib/logger"
import {
  server,
  mockCredentialsResponse,
  mockEmailResponse,
  mockGithubResponse,
} from "./helpers/mocks"
import { signIn } from "../../react"
import { rest } from "msw"

const { location } = window

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

  let _href = window.location.href
  // Allows to mutate `window.location`...
  delete window.location

  window.location = {
    reload: jest.fn(),
  }
  Object.defineProperty(window.location, "href", {
    get: () => _href,
    // whatwg-fetch or whatwg-url does not seem to work with relative URLs
    set: (href) => {
      _href = href.startsWith("/") ? `http://localhost${href}` : href
      return _href
    },
  })
})

beforeEach(() => {
  jest.clearAllMocks()
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
      expect(window.location.href).toBe(
        `http://localhost/api/auth/signin?${new URLSearchParams({
          callbackUrl,
        })}`
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

    const callbackUrl = window.location.href
    userEvent.click(screen.getByRole("button"))

    await waitFor(() => {
      expect(window.location.href).toBe(
        `http://localhost/api/auth/signin?${new URLSearchParams({
          callbackUrl,
        })}`
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
      expect(window.location.href).toBe(mockUrl)
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
    expect(window.location.href).toBe(mockGithubResponse.url)
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
    expect(window.location.href).not.toBe(mockCredentialsResponse.url)

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
    expect(window.location.href).not.toBe(mockEmailResponse.url)

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
    rest.post("http://localhost/api/auth/signin/email", (req, res, ctx) => {
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
    expect(window.location.href).toBe(mockUrlWithHash)
    // the browser will not refresh the page if the redirect URL contains a hash, hence we force it on the client, see #1289
    expect(window.location.reload).toHaveBeenCalledTimes(1)
  })
})

test("params are propagated to the signin URL when supplied", async () => {
  let matchedParams = ""
  const authParams = "foo=bar&bar=foo"

  server.use(
    rest.post("http://localhost/api/auth/signin/github", (req, res, ctx) => {
      matchedParams = req.url.search
      return res(ctx.status(200), ctx.json(mockGithubResponse))
    })
  )

  render(<SignInFlow providerId="github" authorizationParams={authParams} />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(matchedParams).toEqual(`?${authParams}`)
  })
})

test("when it fails to fetch the providers, it redirected back to signin page", async () => {
  const errorMsg = "Error when retrieving providers"

  server.use(
    rest.get("http://localhost/api/auth/providers", (req, res, ctx) =>
      res(ctx.status(500), ctx.json(errorMsg))
    )
  )

  render(<SignInFlow providerId="github" />)

  userEvent.click(screen.getByRole("button"))

  await waitFor(() => {
    expect(window.location.href).toBe(`http://localhost/api/auth/error`)

    expect(logger.error).toHaveBeenCalledTimes(1)
    expect(logger.error).toBeCalledWith("CLIENT_FETCH_ERROR", {
      error: "Error when retrieving providers",
      path: "providers",
    })
  })
})

function SignInFlow({
  providerId,
  callbackUrl,
  redirect = true,
  authorizationParams = {},
}) {
  const [response, setResponse] = useState(null)

  async function handleSignIn() {
    const result = await signIn(
      providerId,
      { callbackUrl, redirect },
      authorizationParams
    )

    setResponse(result)
  }

  return (
    <>
      <p data-testid="signin-result">
        {response ? JSON.stringify(response) : "no response"}
      </p>
      <button onClick={handleSignIn}>Sign in</button>
    </>
  )
}
