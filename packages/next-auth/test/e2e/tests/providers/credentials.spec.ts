import { test, expect } from "@playwright/test"

test.describe("Credentials Provider", () => {
  test("Signin / Signout", async ({ page }) => {
    await test.step("should login", async () => {
      await page.goto("http://localhost:3000/auth/signin")
      await page.getByLabel("Password").fill("password")
      await page
        .getByRole("button", { name: "Sign in with Credentials" })
        .click()
      const session = await page.locator("pre").textContent()

      expect(JSON.parse(session ?? "{}")).toEqual({
        user: {
          email: "test@example.com",
          name: "Test User",
        },
        expires: expect.any(String),
      })
    })

    await test.step("should logout", async () => {
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
