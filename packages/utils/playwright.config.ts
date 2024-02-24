import { join } from "node:path"
import { defineConfig, devices } from "@playwright/test"
import * as dotenv from "dotenv"

if (process.env.NODE_ENV !== "production" && !process.env.CI) {
  dotenv.config({ path: join(process.cwd(), "..", "core", ".env") })
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
      use: { ...devices["Desktop Chrome"], channel: "chrome" },
    },
  ],
  webServer: {
    cwd: "../../",
    command: "turbo run dev --filter=next-auth-app",
    url: "http://localhost:3000",
    timeout: 20_000,
    stdout: process.env.CI ? "ignore" : "pipe",
    stderr: "pipe",
  },
})
