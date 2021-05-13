import { render, screen } from "@testing-library/react"
import { useEffect, useState } from "react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import { getSession } from "../"

const mockSession = {
  user: {
    image: null,
    name: "John",
    email: "john@email.com",
  },
  expires: new Date(),
}

const server = setupServer(
  ...[
    rest.get("/api/auth/session", (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(mockSession))
    }),
  ]
)

function ExamplePage() {
  const [session, setSession] = useState(null)
  useEffect(() => {
    async function fetchUserSession() {
      try {
        const result = await getSession()
        setSession(result)
      } catch (e) {
        console.error(e)
      }
    }
    fetchUserSession()
  }, [])

  if (session) {
    return <pre>{JSON.stringify(session, null, 2)}</pre>
  }
  return <p>No session</p>
}

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test("testing getSession", async () => {
  render(<ExamplePage />)
  const noSession = await screen.findByText("No session")
  expect(noSession).toBeInTheDocument()

  const session = await screen.findByText(new RegExp(mockSession.user.name))
  expect(session).toBeInTheDocument()
})
