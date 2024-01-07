import { test, expect } from "@playwright/test"

test("Sign in with Credentials", async ({ browser }) => {
  // Setup context for tracking cookies on the page
  const context = await browser.newContext()
  const page = await context.newPage()

  // Get CSRF token
  await page.goto("http://localhost:3000/api/auth/csrf")

  // Go to home page
  await page.goto("http://localhost:3000")

  // Click 'Sign In'
  await page.click("#sign-in")

  // Enter Credentials (Username/Password Login) on Credentials
  await page.type("#input-username-for-credentials-provider", "JohnSmith")
  await page.type("#input-password-for-credentials-provider", "ABC123")

  await page.screenshot({
    path: "playwright-screenshots/enter-credentials.png",
    fullPage: true,
  })

  // Press submit Credentials form
  await page.click("#submitButton")

  // Wait for next-auth example page login status header to appear
  await page.waitForTimeout(2000)

  await page.screenshot({
    path: "playwright-screenshots/after-submit.png",
    fullPage: true,
  })

  // Check session object after successful login
  const response = await page.goto("http://localhost:3000/api/auth/session")
  await page.screenshot({
    path: "playwright-screenshots/get-session.png",
    fullPage: true,
  })

  const session = await response?.json()
  expect(session?.user?.name).toBe("JohnSmith")
})
