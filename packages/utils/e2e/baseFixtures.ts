import * as fs from "fs"
import * as path from "path"
import * as crypto from "crypto"
import { test as baseTest } from "@playwright/test"

const istanbulCLIOutput = path.join(process.cwd(), "..", ".nyc_output")

export const test = baseTest.extend({
  context: async ({ context }, use) => {
    await context.addInitScript(() =>
      window.addEventListener("beforeunload", () =>
        (window as any).collectIstanbulCoverage(
          JSON.stringify((window as any).__coverage__)
        )
      )
    )
    await fs.promises.mkdir(istanbulCLIOutput, { recursive: true })
    await context.exposeFunction(
      "collectIstanbulCoverage",
      (coverageJSON: string) => {
        if (coverageJSON)
          fs.writeFileSync(
            path.join(
              istanbulCLIOutput,
              `playwright_coverage_${crypto.randomUUID()}.json`
            ),
            coverageJSON
          )
      }
    )
    await use(context)
    for (const page of context.pages()) {
      await page.evaluate(() =>
        (window as any).collectIstanbulCoverage(
          JSON.stringify((window as any).__coverage__)
        )
      )
    }
  },
})

export const expect = test.expect
