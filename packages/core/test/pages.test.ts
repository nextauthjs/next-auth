import { vi, expect, it, describe, beforeEach } from "vitest"
import renderPage from "../src/lib/pages/index"
import { pagesOptions } from "./fixtures/pages"
import { init } from "../src/lib/init"
import SignoutPageOriginal from "../src/lib/pages/signout"

const mocks = vi.hoisted(() => ({
  // SignoutPage: vi.fn((props) => `<div>${props.url}</div>`),
  SignoutPage: vi.fn(),
  // SignoutPage: vi.doMock('./increment.js', () => ({ increment: () => ++mockedIncrement }))
}))

vi.mock("preact-render-to-string", () => ({
  default: vi.fn(),
  renderToString: vi.fn(),
}))

vi.mock("../src/lib/pages/signout", () => ({
  default: mocks.SignoutPage,
}))

describe("built-in pages", () => {
  // beforeEach(() => {
  //   vi.resetAllMocks()
  // })

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
    console.log("init.options", options)

    const render = renderPage({ ...options, query: {}, cookies: [] })
    const signOutPage = render.signout()
    console.log("signoutPage.page", signOutPage)

    expect(mocks.SignoutPage).toHaveBeenCalled()
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
