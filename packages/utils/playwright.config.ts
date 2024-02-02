import { defineConfig, devices } from "@playwright/test"

/** See https://playwright.dev/docs/test-configuration. */
export default defineConfig({
  testDir: `../core/test/e2e`, // TODO: `core` should not be hardcoded here
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: { trace: "on-first-retry" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    command: "cd ../../apps/dev/nextjs && pnpm start",
    url: "http://localhost:3000",
    timeout: 10_000,
    reuseExistingServer: !process.env.CI,
  },
})
