import { join } from "node:path"
import { defineConfig, devices } from "@playwright/test"
import * as dotenv from "dotenv"

if (!process.env.CI) {
  const path = process.env.TEST_DOCKER
    ? join(process.cwd(), "..", "..", "..", "packages", "core", ".env")
    : join(process.cwd(), "..", "core", ".env")

  dotenv.config({ path })
}

/** See https://playwright.dev/docs/api/class-testconfig. */
export default defineConfig({
  testDir: "../",
  testMatch: "**/test/e2e/*.spec.ts",
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI
    ? "dot"
    : [["line"], ["html", { open: "on-failure" }]],
  use: { trace: "on" },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    cwd: "../../",
    command: "turbo run dev --filter=next-auth-app",
    port: 3000,
    timeout: 100_000,
    stdout: process.env.CI ? "ignore" : "pipe",
    stderr: "pipe",
    reuseExistingServer: !process.env.CI,
  },
})
