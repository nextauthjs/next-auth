import { test, expect } from "@playwright/test"

test.describe("KeyCloak Provider", () => {
  test("Signin / Signout", async ({ page }) => {
    if (
      !process.env.TEST_KEYCLOAK_USERNAME ||
      !process.env.TEST_KEYCLOAK_PASSWORD
    )
      throw new TypeError("Missing TEST_KEYCLOAK_{USERNAME,PASSWORD}")

    await test.step("should login", async () => {
      await page.goto("http://localhost:3000/auth/signin")
      await page.getByText("Keycloak").click()
      // Keycloak-hosted login form
      await page
        .getByLabel("Username or email")
        .fill(process.env.TEST_KEYCLOAK_USERNAME!)
      await page.locator("#password").fill(process.env.TEST_KEYCLOAK_PASSWORD!)
      await page.getByRole("button", { name: "Sign In" }).click()

      // Should return to dev app
      await page.waitForTimeout(1000)
      const session = await page.locator("pre").textContent()

      expect(JSON.parse(session ?? "{}")).toEqual({
        user: {
          name: "bob",
        },
        expires: expect.any(String),
      })
    })

    await test.step("should logout", async () => {
      // TODO: Enable the test
      test.skip(
        true,
        "The session isn't cleared after signout, until the next page load"
      )
      await page
        .getByRole("banner")
        .getByRole("button", { name: "Sign out" })
        .click()

      // Wait on server-side signout req
      await page.waitForTimeout(1000)

      const session = await page.locator("pre").textContent()
      expect(JSON.parse(session ?? "{}")).toBeNull()
    })
  })
})
