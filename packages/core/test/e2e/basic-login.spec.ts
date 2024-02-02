import { test, expect, Page } from "@playwright/test"
// import v8toIstanbul from "v8-to-istanbul"
// import { writeFile } from "fs/promises"

// TODO
async function withCoverage(page: Page, fn: () => Promise<void>) {
  // await page.coverage.startJSCoverage()
  await fn()
  // const coverage = await page.coverage.stopJSCoverage()
  // for (const entry of coverage) {
  //   const converter = v8toIstanbul("", 0, { source: entry.source ?? "" })
  //   await converter.load()
  //   converter.applyCoverage(entry.functions)
  //   await writeFile(
  //     `???`,
  //     JSON.stringify(converter.toIstanbul()),
  //     "utf8"
  //   )
  // }
}

test("Basic login", async ({ page }) => {
  if (
    !process.env.TEST_KEYCLOAK_USERNAME ||
    !process.env.TEST_KEYCLOAK_PASSWORD
  )
    throw new TypeError("Incorrect TEST_KEYCLOAK_{USERNAME,PASSWORD}")

  // await withCoverage(page, async () => {
  await page.goto("http://localhost:3000/auth/signin")
  await page.getByText("Keycloak").click()
  await page.getByText("Username or email").waitFor()
  await page
    .getByLabel("Username or email")
    .fill(process.env.TEST_KEYCLOAK_USERNAME)
  await page.locator("#password").fill(process.env.TEST_KEYCLOAK_PASSWORD)
  await page.getByRole("button", { name: "Sign In" }).click()
  await page.waitForURL("http://localhost:3000")
  const session = await page.locator("pre").textContent()
  expect(JSON.parse(session ?? "{}")).toEqual({
    user: {
      email: "info@balazsorban.com",
      name: "Balázs Orbán",
      image: "https://avatars.githubusercontent.com/u/18369201?v=4",
    },
    expires: expect.any(String),
  })
  // })
})
