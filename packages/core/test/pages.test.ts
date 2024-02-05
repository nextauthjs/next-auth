import { vi, expect, it, describe, beforeEach } from "vitest"
import renderPage from "../src/lib/pages/index"
import { pagesOptions } from "./fixtures/pages"
import { init } from "../src/lib/init"

const mocks = vi.hoisted(() => ({
  SignoutPage: vi.fn().mockImplementation((props: any) => {
    console.log("SignoutPage.props", props)
    return `<form action="${props.url.toString()}" method="POST">`
  }),
  SigninPage: vi.fn(),
}))

vi.mock("preact-render-to-string", () => {
  return {
    renderToString: (e: any) => {
      return e
    },
  }
})

vi.mock("../src/lib/pages/signin", () => ({
  default: mocks.SigninPage,
}))

vi.mock("../src/lib/pages/signout", () => ({
  default: mocks.SignoutPage,
}))

describe("pages", () => {
  describe("sign-out", () => {
    beforeEach(() => {
      vi.resetAllMocks()
    })

    it("should attempt to render signout page", async () => {
      // When visiting `/auth/signout`, for example
      const { options } = await init({
        authOptions: pagesOptions,
        action: "signout",
        providerId: "github",
        url: new URL("http://localhost:3000/auth/signout"),
        cookies: {},
        isPost: true,
        csrfDisabled: true,
      })

      const render = renderPage({ ...options, query: {}, cookies: [] })
      const signOutPage = render.signout()

      console.log(signOutPage)

      expect(mocks.SignoutPage).toHaveBeenCalled()
      expect(signOutPage.body).toContain(`<title>Sign Out</title>`)
      expect(signOutPage.body).toContain(
        `action="http://localhost:3000/auth/signout"`
      )
    })

    it("should return correct URL for signout page form action", async () => {
      // When visiting `/auth/signout`, for example
      const { options } = await init({
        authOptions: pagesOptions,
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
      // When visiting `/auth/signin`, for example
      const { options } = await init({
        authOptions: pagesOptions,
        action: "signin",
        providerId: "github",
        url: new URL("http://localhost:3000/auth/signin"),
        cookies: {},
        isPost: true,
        csrfDisabled: true,
      })

      const render = renderPage({ ...options, query: {}, cookies: [] })
      const signInPage = render.signin()
      // console.log(signInPage)

      expect(mocks.SigninPage).toHaveBeenCalled()
      expect(signInPage.body).toContain(`<title>Sign In</title>`)
      // expect(signInPage.body).toContain(
      //   `action="http://localhost:3000/auth/signin"`
      // )
    })
  })
})
