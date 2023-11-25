import { describe, expect, it } from "vitest"


describe("suite", () => {
  it("msw mock http://hello", async () => {
    const reponse = await fetch(
      "https://next-auth-example.com/api/auth/session"
    )
    const data = await reponse.json()
    expect(data).toEqual({
      user: {
        name: "John Doe",
        email: "john@doe.com",
        image: "https://next-auth-example.com/avatar.jpg",
      },
    })
  })
})

