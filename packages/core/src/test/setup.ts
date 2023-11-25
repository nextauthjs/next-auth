import { afterAll, afterEach, beforeAll } from "vitest"
import { setupServer } from "msw/node"
import { HttpResponse, http } from "msw"

const authOptions = [

]

export const restHandlers = [
  http.get("https://next-auth-example.com/api/auth/session", () => {
    return HttpResponse.json({
      user: {
        name: "John Doe",
        email: "john@doe.com",
        image: "https://next-auth-example.com/avatar.jpg",
      },
    })
  }),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: "error" }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
