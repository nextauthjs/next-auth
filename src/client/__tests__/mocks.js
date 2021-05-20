import { setupServer } from "msw/node"
import { rest } from "msw"

export const mockSession = {
  user: {
    image: null,
    name: "John",
    email: "john@email.com",
  },
  expires: new Date(),
}

export const server = setupServer(
  rest.get("/api/auth/session", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockSession))
  }),
  rest.post("/api/auth/_log", (req, res, ctx) => {
    return res(ctx.status(200))
  })
)
