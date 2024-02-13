import { expect, test } from "./helpers/authTest"

test.describe("user profile", () => {
  test("profile values", async ({ webapp }) => {
    try {
      await webapp.login()
      await webapp.getSession()
      expect(webapp.session.user.sub).toMatch(
        /^[a-f\d]{4}(?:[a-f\d]{4}-){4}[a-f\d]{12}$/i
      )
    } catch (error) {
      console.error(error)
    }
  })
})
