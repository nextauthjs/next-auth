import * as config from "./config"

import { shouldSkip } from "./skip"
import { verify as verify } from "./verify"
import { analyze } from "./analyze"
import { publish } from "./publish"

async function run() {
  if (config.dryRun) {
    console.log("\nPerforming dry run, no packages will be published!\n")
  }

  if (await shouldSkip({ releaseBranches: config.releaseBranches })) {
    return
  }

  if (config.dryRun) {
    console.log("\nDry run, skip validation...\n")
  } else {
    await verify()
  }

  const packages = await analyze(config)
  console.log(packages)

  // await publish({ ...config, packages })
}

run().catch((err) => {
  console.log(err)
  process.exit(1)
})
