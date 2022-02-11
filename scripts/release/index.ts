import { config } from "./config"
import { shouldSkip } from "./skip"
import { verify as verify } from "./verify"
import { analyze } from "./analyze"
import { publish } from "./publish"

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

  if (process.env.DEBUG) console.log("[debug] packages", packages)

  await publish({ ...config, packages })
}

run().catch((err) => {
  console.log(err)
  process.exit(1)
})
