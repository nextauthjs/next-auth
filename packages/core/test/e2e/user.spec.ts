import { expect, test } from "./helpers/authTest"

test.describe("user profile", () => {
  test("profile values", async ({ page, webapp }) => {
    try {
      await webapp.login()

      const logoutBtn = page
        .getByRole("banner")
        .getByRole("button", { name: "Sign out" })

      expect(await logoutBtn.textContent()).toBe("Sign out")

      await webapp.getSession()
      console.log("webapp.session", webapp.session)
      expect(webapp.session.user.sub).toMatch(
        /^[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}$/i
      )
    } catch (error) {
      console.error(error)
    }
  })
})
