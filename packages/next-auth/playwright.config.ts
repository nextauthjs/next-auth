// import { join } from "node:path"
import { defineConfig, devices } from "@playwright/test"
// import * as dotenv from "dotenv"

// Use process.env.PORT by default and fallback to port 3000
const PORT = process.env.PORT || 3000

// Set webServer.url and use.baseURL with the location of the WebServer respecting the correct set port
const baseURL = `http://localhost:${PORT}`

// if (!process.env.CI) {
//   const path = process.env.TEST_DOCKER
//     ? join(process.cwd(), "..", "..", "..", "packages", "core", ".env")
//     : join(process.cwd(), "..", "core", ".env")

//   dotenv.config({ path })
// }

/** See https://playwright.dev/docs/api/class-testconfig. */
export default defineConfig({
  testDir: "../",
  // Artifacts folder where screenshots, videos, and traces are stored.
  outputDir: "test-results/",
  testMatch: "**/test/e2e/**/*.spec.ts",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? "dot"
    : [["line"], ["html", { open: "on-failure" }]],
  use: {
    // Use baseURL so to make navigations relative.
    // More information: https://playwright.dev/docs/api/class-testoptions#test-options-base-url
    baseURL,

    // Retry a test if its failing with enabled tracing. This allows you to analyze the DOM, console logs, network traffic etc.
    // More information: https://playwright.dev/docs/trace-viewer
    trace: "retry-with-trace",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    cwd: "../../apps/dev/nextjs",
    command: "pnpm dev",
    url: baseURL,
    stdout: "pipe",
    reuseExistingServer: !process.env.CI,
  },
})
