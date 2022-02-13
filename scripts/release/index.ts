import { config } from "./config"
import { shouldSkip } from "./skip"
import { verify as verify } from "./verify"
import { analyze } from "./analyze"
import { publish } from "./publish"
import { debug } from "./utils"

async function run() {
  if (config.dryRun) {
    console.log("\nPerforming dry run, no packages will be published!\n")
  }

  if (shouldSkip({ releaseBranches: config.releaseBranches })) {
    return
  }

  if (config.dryRun) {
    console.log("\nDry run, skip validation...\n")
  } else {
    await verify()
  }

  const packages = await analyze(config)

  if (!packages.length) return

  debug(
    "Packages to release:",
    packages.map((p) => JSON.stringify(p, null, 2)).join("\n")
  )

  await publish({ ...config, packages })
}

run().catch((err) => {
  console.log(err)
  process.exit(1)
})
