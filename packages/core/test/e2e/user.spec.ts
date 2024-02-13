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
      console.log("session", webapp.session)
    } catch (error) {
      console.error(error)
    }
  })
})
