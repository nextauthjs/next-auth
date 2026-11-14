import { loadEnvConfig } from "@next/env"
import { defineConfig, devices } from "@playwright/test"

// Load `.env.local` like `next dev` does, so the test can read
// MOCKATOO_TEST_EMAIL and MOCKATOO_TEST_PASSWORD from it.
loadEnvConfig(process.cwd())

const PORT = process.env.PORT || 3000
const baseURL = `http://localhost:${PORT}`

/** See https://playwright.dev/docs/api/class-testconfig. */
export default defineConfig({
  testDir: "./tests",
  outputDir: "test-results/",
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? "dot" : [["line"]],
  use: {
    baseURL,
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    // Outside production, GitHub sign-in goes to Mockatoo (see auth.ts).
    command: "pnpm dev",
    url: baseURL,
    stdout: "pipe",
    reuseExistingServer: !process.env.CI,
  },
})
