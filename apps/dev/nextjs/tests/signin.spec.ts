import { test, expect } from "@playwright/test"

test("Sign in with Auth0", async ({ page }) => {
  // Go to NextAuth example app
  await page.goto("https://next-auth-example.vercel.app")

  // Click 'Sign In'
  await page.click("#__next > header > div > p > a")

  // Auth0 Login Provider
  await page.click('body > div > div form[action*="auth0"] > button')

  // Enter Credentials (Username/Password Login) on Auth0 Widget
  await page.type("#username", process.env.AUTH0_USERNAME!)
  await page.type("#password", process.env.AUTH0_PASSWORD!)

  // Snap a screenshot
  // await page.screenshot({ path: "1-auth0-login.png", fullPage: true })

  // Press submit on Auth0 form
  await page.click('body > div > main > section > div button[type="submit"]')

  // Wait for next-auth example page login status header to appear
  await page.waitForTimeout(2000)

  // Snap a screenshot
  // await page.screenshot({
  //   path: "2-next-auth-redirect-result.png",
  //   fullPage: false,
  // })

  // Check session object after successful login
  const response = await page.goto(
    "https://next-auth-example.vercel.app/api/auth/session"
  )
  const session = await response?.json()
  expect(session?.user?.email).toBe(process.env.AUTH0_USERNAME)
  // TODO: Check whole object with .toEqual()
})
