import { test, expect } from "@playwright/test"

const MOCKATOO_ORIGIN = "https://app.mockatoo.globalunderdog.com"

test("GitHub sign-in goes to Mockatoo in development", async ({ page }) => {
  await page.goto("/auth/signin")
  await page.getByRole("button", { name: "Sign in with GitHub" }).click()

  await expect(page).toHaveURL(new RegExp(`^${MOCKATOO_ORIGIN}/`))
  await expect(page.getByLabel("Email", { exact: true })).toBeVisible()
})

test("Sign in / Sign out with GitHub (Mockatoo)", async ({ page }) => {
  const email = process.env.MOCKATOO_TEST_EMAIL
  const password = process.env.MOCKATOO_TEST_PASSWORD
  test.skip(
    !email || !password,
    "Set MOCKATOO_TEST_EMAIL and MOCKATOO_TEST_PASSWORD to run this test"
  )

  await test.step("should sign in", async () => {
    await page.goto("/auth/signin")
    await page.getByRole("button", { name: "Sign in with GitHub" }).click()

    // Mockatoo-hosted login and consent pages
    await page.getByLabel("Email", { exact: true }).fill(email!)
    await page.getByLabel("Password", { exact: true }).fill(password!)
    await page.getByRole("button", { name: "Log in with password" }).click()
    await page.getByRole("button", { name: "Authorize" }).click()

    // Back in the example app, signed in
    await expect(page.getByRole("banner")).toContainText(email!)
  })

  await test.step("should sign out", async () => {
    // The avatar button opens the user menu. Retry until the page has
    // hydrated, since `pnpm dev` may still be compiling it.
    const signOut = page
      .getByRole("menuitem")
      .getByRole("button", { name: "Sign Out" })
    await expect(async () => {
      await page.getByRole("banner").getByRole("button").last().click()
      await expect(signOut).toBeVisible({ timeout: 1000 })
    }).toPass()
    await signOut.click()

    await expect(
      page.getByRole("banner").getByRole("button", { name: "Sign In" })
    ).toBeVisible()
  })
})
