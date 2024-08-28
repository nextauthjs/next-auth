import { vi, expect, it, describe, beforeEach } from "vitest"
import renderPage from "../src/lib/pages/index"
import { authOptions } from "./fixtures/pages"
import { init } from "../src/lib/init"

describe("pages", () => {
  describe("sign-out", () => {
    beforeEach(() => {
      vi.resetAllMocks()
    })

    it("should attempt to render signout page", async () => {
      // Generated when visiting `/auth/signout`
      const { options } = await init({
        authOptions,
        action: "signout",
        providerId: "github",
        url: new URL("http://localhost:3000/auth/signout"),
        cookies: {},
        isPost: true,
        csrfDisabled: true,
      })

      const render = renderPage({ ...options, query: {}, cookies: [] })
      const signOutPage = render.signout()

      expect(signOutPage.body).toContain(`<title>Sign Out</title>`)
      expect(signOutPage.body).toContain(
        `action="http://localhost:3000/auth/signout"`
      )
    })

    it("should return correct URL for signout page form action", async () => {
      // When visiting `/auth/signout`, for example
      const { options } = await init({
        authOptions: authOptions,
        action: "signout",
        providerId: "github",
        url: new URL("http://localhost:3000/auth/signout"),
        cookies: {},
        isPost: true,
        csrfDisabled: true,
      })

      expect(options.url).toBeInstanceOf(URL)
      expect(options.url.toString()).toBe("http://localhost:3000/auth/signout")
    })
  })
  describe("sign-in", () => {
    beforeEach(() => {
      vi.resetAllMocks()
    })

    it("should attempt to render signin page", async () => {
      // Generated when visiting `/auth/signin`
      const { options } = await init({
        authOptions: authOptions,
        action: "signin",
        providerId: "github",
        url: new URL("http://localhost:3000/auth/signin"),
        cookies: {},
        isPost: true,
        csrfDisabled: true,
      })

      const render = renderPage({ ...options, query: {}, cookies: [] })
      const signInPage = render.signin()

      expect(signInPage.body).toContain(`<title>Sign In</title>`)
      expect(signInPage.body).toContain(
        `action="http://localhost:3000/auth/signin/github"`
      )
    })
  })
})
