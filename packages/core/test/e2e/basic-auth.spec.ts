import { test, expect } from "@playwright/test"

test.describe("Basic Auth", () => {
  test("Credentials Signin / Signout", async ({ page }) => {
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

  test("Keycloak Signin / Signout", async ({ page }) => {
    if (
      !process.env.TEST_KEYCLOAK_USERNAME ||
      !process.env.TEST_KEYCLOAK_PASSWORD
    )
      throw new TypeError("Missing TEST_KEYCLOAK_{USERNAME,PASSWORD}")

    await test.step("should login", async () => {
      await page.goto("http://localhost:3000/auth/signin")
      await page.getByText("Keycloak").click()
      await page
        .getByLabel("Username or email")
        .fill(process.env.TEST_KEYCLOAK_USERNAME!)
      await page.locator("#password").fill(process.env.TEST_KEYCLOAK_PASSWORD!)
      await page.getByRole("button", { name: "Sign In" }).click()
      const session = await page.locator("pre").textContent()

      expect(JSON.parse(session ?? "{}")).toEqual({
        user: {
          email: "bob@alice.com",
          name: "Bob Alice",
          image: "https://avatars.githubusercontent.com/u/67470890?s=200&v=4",
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
