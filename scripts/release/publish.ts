import type { PackageToRelease } from "./types"
import type { PackageJson } from "type-fest"

import path from "path"
import { execSync } from "child_process"
// @ts-ignore
import jsonfile from "jsonfile"

export async function publish(options: {
  dryRun: boolean
  packages: PackageToRelease[]
  rootDir: string
  RELEASE_COMMIT_MSG: string
}) {
  const { dryRun, packages, rootDir, RELEASE_COMMIT_MSG } = options

  if (dryRun) {
    console.log("Dry run, skip release commit...")
  } else {
    for await (const pkg of packages) {
      console.log(`Writing version to package.json for package ${pkg.name}`)
      const file = path.join(rootDir, pkg.path, "package.json")
      const packageJson = (await jsonfile.readFile(file)) as PackageJson
      await jsonfile.writeFile(
        file,
        { ...packageJson, version: pkg.newVersion },
        { spaces: 2 }
      )
    }

    console.log("All package.json files have been written, committing...")
    execSync(`git add -A && git commit -m "${RELEASE_COMMIT_MSG}"`)
    console.log("Commited.")
  }

  for (const pkg of packages) {
    // We need different tokens for `next-auth` and `@next-auth/*` packages
    if (pkg.name === "next-auth") {
      process.env.NPM_TOKEN = process.env.NEXT_AUTH_PKG_NPM_TOKEN
    } else {
      process.env.NPM_TOKEN = process.env.NEXT_AUTH_ORG_NPM_TOKEN
    }

    let npmPublish = `npm publish --access public`
    if (dryRun) {
      console.log(`Dry run, skip npm publish for package ${pkg.name}...`)
      npmPublish += " --dry-run"
    }

    execSync(`cd ${pkg.path} && ${npmPublish}`)
  }

  for (const pkg of packages) {
    const { name, oldVersion, newVersion, changelog } = pkg
    const gitTag = `${name}@v${newVersion}`

    console.log(`${name} ${oldVersion} -> ${newVersion}`)
    if (dryRun) {
      console.log(`Dry run, skip git tag/release notes for package ${name}`)
    } else {
      console.log(`Creating git tag...`)
      execSync(`git tag ${gitTag}`)
      console.log(`Creating github release...`)
      execSync(`gh release create ${gitTag} --notes '${changelog}'`)
    }
  }

  if (!dryRun) {
    execSync(`git push --tags`)
    execSync(`git push`)
  }
}
