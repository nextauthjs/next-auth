import { defineConfig, devices } from "@playwright/test"

/** See https://playwright.dev/docs/test-configuration. */
export default defineConfig({
  testDir: `../core/test/e2e`, // TODO: `core` should not be hardcoded here
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "dot" : "html",
  use: { trace: "on" },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  webServer: {
    // TODO: Create test app instead of using the `dev` app.
    command:
      // "turbo run build --filter=next-auth-app && cd ../../apps/dev/nextjs && pnpm start",
      "cd ../../ && pnpm dev",
    url: "http://localhost:3000",
    timeout: 10_000,
    reuseExistingServer: !process.env.CI,
  },
})
