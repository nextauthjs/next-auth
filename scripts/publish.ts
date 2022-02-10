import type { Commit } from "./types"
import type { PackageJson } from "type-fest"

// Originally ported to TS from https://github.com/remix-run/react-router/tree/main/scripts/{version,publish}.js
import path from "path"
import { execSync } from "child_process"
// @ts-ignore
import jsonfile from "jsonfile"
import semver from "semver"
import parseCommit from "@commitlint/parse"
// @ts-ignore
import gitLog from "git-log-parser"
// @ts-ignore
import streamToArray from "stream-to-array"
import {
  BREAKING_COMMIT_MSG,
  PackageName,
  packages,
  RELEASE_COMMIT_MSG,
  RELEASE_COMMIT_TYPES,
  rootDir,
  SKIP_CI_COMMIT_MSG,
} from "./config"

/*
 * 1. Get a list of commits since the last tag
 * 2. Early bailout ([skip ci] or chore(release): "bump version")
 * 3. Filter out commits that did not touch package code
 * 4. Group commits by package
 * 5. For each package
 *    5.1. Group commits by type (Features, Bug fixes, Other)
 *    5.2. Determine the next version
 *    5.3. Update package.json with the new version
 *    5.4. Create the changelog
 *    5.5. Create git tag/release
 * 6. Commit changes
 * 7. Push git tag/release/commits
 * 8. Push to npm
 */

async function run() {
  const dryRun = false
  const packageFolders = Object.values(packages)

  // Get the latest tag
  console.log("Identifying latest tag...")
  const latestTag = execSync("git describe --tags --abbrev=0").toString().trim()
  console.log(`Latest tag identified: ${latestTag}`)

  console.log()

  console.log("Identifying commits since the latest tag...")

  async function getCommitsSinceLatestTag(latestTag: string) {
    const range = `${latestTag}..HEAD`

    // Get the commits since the latest tag
    const commitsSinceLatestTag = await new Promise<Commit[]>(
      (resolve, reject) => {
        const stream: ReadableStream = gitLog.parse({ _: range })
        streamToArray(stream, function (err: Error, arr: any[]) {
          if (err) return reject(err)

          Promise.all(
            arr.map(async (d) => {
              const parsed = await parseCommit(d.subject)

              return { ...d, parsed }
            })
          ).then((res) => resolve(res.filter(Boolean)))
        })
      }
    )

    console.log(
      commitsSinceLatestTag.length,
      `commits found since ${latestTag}`
    )

    return commitsSinceLatestTag
  }

  function getChangedFiles(commitSha: string) {
    return execSync(`git diff-tree --no-commit-id --name-only -r ${commitSha}`)
      .toString()
      .trim()
      .split("\n")
  }

  function getPackageCommits(commits: Commit[], packageFolders: string[]) {
    console.log()
    console.log("Identifying commits that touched package code...")

    const packageCommits = commits.filter(({ commit }) => {
      const changedFiles = getChangedFiles(commit.short)
      return packageFolders.some((packageFolder) =>
        changedFiles.some((changedFile) =>
          changedFile.startsWith(packageFolder)
        )
      )
    })

    console.log(packageCommits.length, "commits touched package code")

    return packageCommits
  }

  // 1. Get a list of commits since the last tag
  const commitsSinceLatestTag = await getCommitsSinceLatestTag(latestTag)

  // 2. Early bailout ([skip ci] or chore(release): "bump version")
  const lastCommit = commitsSinceLatestTag[0]
  const shouldSkipCI =
    lastCommit.parsed.raw.includes(SKIP_CI_COMMIT_MSG) || process.env.SKIP_CI
  const justReleased = lastCommit.parsed.raw === RELEASE_COMMIT_MSG
  if (shouldSkipCI || justReleased) {
    console.log(shouldSkipCI ? "Skipping CI..." : "Already released...")
    return
  }

  // 3. Filter out commits that did not touch package code
  const packageCommits = getPackageCommits(
    commitsSinceLatestTag,
    packageFolders
  )

  console.log()

  console.log("Identifying packages that need a new release...")
  // 4. Group commits by package
  const commitsByPackage = packageCommits.reduce((acc, commit) => {
    if (!RELEASE_COMMIT_TYPES.includes(commit.parsed.type)) {
      return acc
    }

    const changedFiles = getChangedFiles(commit.commit.short)

    Object.entries(packages).forEach(([packageName, src]) => {
      if (changedFiles.some((changedFile) => changedFile.startsWith(src))) {
        if (!(packageName in acc)) {
          acc[packageName] = []
        }
        acc[packageName].push(commit)
      }
    })
    return acc
  }, {} as Record<string, Commit[]>)

  const changedPackages = Object.keys(commitsByPackage)
  if (changedPackages.length) {
    console.log(
      changedPackages.length,
      `packages need a new release: ${changedPackages.join(", ")}`
    )
  } else {
    console.log("No packages needed a new release, BYE!")
    return
  }

  console.log()

  // 5. For each package
  const packagesToRelease = []
  for (const packageName in commitsByPackage) {
    // 5.1. Group commits by type (Features, Bug fixes, Other)
    const grouppedPackage = commitsByPackage[
      packageName as keyof typeof commitsByPackage
    ].reduce(
      (acc, commit) => {
        const { type } = commit.parsed
        if (type === "feat") acc.features.push(commit)
        else if (type === "fix") acc.bugfixes.push(commit)
        else acc.other.push(commit)
        return acc
      },
      { features: [], bugfixes: [], other: [] } as Record<
        "features" | "bugfixes" | "other",
        Commit[]
      >
    )

    const featuresHasBreaking = grouppedPackage.features.some((c) =>
      c.parsed.raw.includes(BREAKING_COMMIT_MSG)
    )

    // 5.2. Determine the next version
    const releaseType: semver.ReleaseType = grouppedPackage.features.length
      ? featuresHasBreaking
        ? "major" // 1.x.x
        : "minor" // x.1.x
      : grouppedPackage.bugfixes.length
      ? "patch" // x.x.1
      : "prerelease" // x.x.x-prerelease.1

    const file = path.join(
      rootDir,
      packages[packageName as PackageName],
      "package.json"
    )

    const packageJson = (await jsonfile.readFile(file)) as PackageJson
    async function getVersions() {
      const oldVersion = packageJson.version!
      const newSemVer = semver.parse(semver.inc(oldVersion, releaseType))!

      return {
        oldVersion,
        newVersion: `${newSemVer.major}.${newSemVer.minor}.${newSemVer.patch}`,
      }
    }

    async function writeNewVersion(version: string) {
      await jsonfile.writeFile(file, { ...packageJson, version }, { spaces: 2 })
    }

    function createChangelog() {
      let changelog = `
# Changes
---
`
      if (grouppedPackage.features.length) {
        changelog += `
## Features

${grouppedPackage.features.map((c) => `  - ${c.parsed.raw}`).join("\n")}`
      }
      if (grouppedPackage.bugfixes.length) {
        changelog += `
## Bug Fixes

${grouppedPackage.bugfixes.map((c) => `  - ${c.parsed.raw}`).join("\n")}`
      }
      if (grouppedPackage.other.length) {
        changelog += `
## Other

${grouppedPackage.other.map((c) => `  - ${c.parsed.raw}`).join("\n")}`
      }

      return changelog
    }

    // 5.3. Update package.json with the new version
    const { oldVersion, newVersion } = await getVersions()

    if (dryRun) {
      console.log("Dry run, skip writing package.json...")
    } else {
      await writeNewVersion(newVersion)
    }

    // 5.4. Create the changelog
    const changelog = createChangelog()

    packagesToRelease.push({
      name: packageName,
      newVersion,
      oldVersion,
      changelog,
    })
  }

  console.log()

  if (dryRun) {
    console.log("Dry run, skip release commit...")
  } else {
    // 6. Commit changes
    execSync(`git add -A && git commit -m "${RELEASE_COMMIT_MSG}"`)
    console.log("Release commit created")
  }

  if (dryRun) {
    console.log(
      `Dry run, skip npm publish, GitHub tag, release and push for packages: ${packagesToRelease
        .map((p) => p.name)
        .join(", ")}`
    )
  } else {
    // 8. Push to npm
    packagesToRelease.forEach((p) => {
      const cd = `cd ${packages[p.name as PackageName]}`
      if (p.name !== "next-auth") {
        // When publishing a `@next-auth` package, we need a different token
        process.env.NPM_TOKEN = process.env.NEXT_AUTH_ORG_NPM_TOKEN
      }
      const npmPublish = `npm publish --access public --tag experimental --dry-run`
      execSync(`${cd} && ${npmPublish}`, { stdio: "inherit" })
    })

    packagesToRelease.forEach((p) => {
      const { name, oldVersion, newVersion, changelog } = p
      const gitTag = `${name}@v${newVersion}`

      console.log(`${name} ${oldVersion} -> ${newVersion}`)
      // 7. Push git tag/release/commits
      execSync(`git tag ${gitTag}`)
      console.log(`Creating github release...`)

      execSync(`gh release create ${gitTag} --draft --notes '${changelog}'`)
    })

    execSync(`git push --tags`)
    execSync(`git push`)
  }

  console.log()

  return
}

run().catch((err) => {
  console.log(err)
  process.exit(1)
})
