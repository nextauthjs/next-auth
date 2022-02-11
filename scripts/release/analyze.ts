import type { Commit, PackageToRelease } from "./types"

import { execSync } from "child_process"
import { pkgJson } from "./utils"
import semver from "semver"
import parseCommit from "@commitlint/parse"
// @ts-ignore
import gitLog from "git-log-parser"
// @ts-ignore
import streamToArray from "stream-to-array"

export async function analyze(options: {
  dryRun: boolean
  packages: Record<string, string>
  BREAKING_COMMIT_MSG: string
  RELEASE_COMMIT_MSG: string
  RELEASE_COMMIT_TYPES: string[]
  SKIP_CI_COMMIT_MSG: string
}): Promise<PackageToRelease[]> {
  const {
    packages,
    BREAKING_COMMIT_MSG,
    RELEASE_COMMIT_MSG,
    RELEASE_COMMIT_TYPES,
    SKIP_CI_COMMIT_MSG,
  } = options

  const packageFolders = Object.values(options.packages)

  console.log("Identifying latest tag...")
  const latestTag = execSync("git describe --tags --abbrev=0").toString().trim()
  console.log(`Latest tag identified: ${latestTag}`)

  console.log()

  console.log("Identifying commits since the latest tag...")

  const range = `${latestTag}..HEAD`

  // Get the commits since the latest tag
  const commitsSinceLatestTag = await new Promise<Commit[]>(
    (resolve, reject) => {
      const stream = gitLog.parse({ _: range })
      streamToArray(stream, (err: Error, arr: any[]) => {
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

  console.log(commitsSinceLatestTag.length, `commits found since ${latestTag}`)

  const lastCommit = commitsSinceLatestTag[0]
  if (lastCommit.parsed.raw.includes(SKIP_CI_COMMIT_MSG)) {
    console.log(
      `Last commit contained ${SKIP_CI_COMMIT_MSG}, skipping release...`
    )
    return []
  }
  if (lastCommit.parsed.raw === RELEASE_COMMIT_MSG) {
    console.log("Already released...")
    return []
  }

  console.log()
  console.log("Identifying commits that touched package code...")
  function getChangedFiles(commitSha: string) {
    return execSync(`git diff-tree --no-commit-id --name-only -r ${commitSha}`)
      .toString()
      .trim()
      .split("\n")
  }
  const packageCommits = commitsSinceLatestTag.filter(({ commit }) => {
    const changedFiles = getChangedFiles(commit.short)
    return packageFolders.some((packageFolder) =>
      changedFiles.some((changedFile) => changedFile.startsWith(packageFolder))
    )
  })

  console.log(packageCommits.length, "commits touched package code")

  console.log()

  console.log("Identifying packages that need a new release...")

  const packagesNeedRelease: string[] = []
  const grouppedPackages = packageCommits.reduce((acc, commit) => {
    const changedFilesInCommit = getChangedFiles(commit.commit.short)

    for (const [pkgName, src] of Object.entries(packages)) {
      if (
        changedFilesInCommit.some((changedFile) => changedFile.startsWith(src))
      ) {
        const pkg = acc[pkgName]
        if (!pkg) {
          acc[pkgName] = { features: [], bugfixes: [], other: [] }
        }
        const { type } = commit.parsed
        if (RELEASE_COMMIT_TYPES.includes(type)) {
          if (!packagesNeedRelease.includes(pkgName)) {
            packagesNeedRelease.push(pkgName)
          }
          if (type === "feat") pkg.features.push(commit)
          else pkg.bugfixes.push(commit)
        } else {
          pkg.other.push(commit)
        }
      }
    }
    return acc
  }, {} as Record<string, { features: Commit[]; bugfixes: Commit[]; other: Commit[] }>)

  if (packagesNeedRelease.length) {
    console.log(
      `${
        packagesNeedRelease.length
      } packages need a new release: ${packagesNeedRelease.join(", ")}`
    )
  } else {
    console.log("No packages needed a new release, BYE!")

    return []
  }

  console.log()

  const packagesToRelease: PackageToRelease[] = []
  for await (const pkgName of packagesNeedRelease) {
    const commits = grouppedPackages[pkgName]
    const featuresHasBreaking = commits.features.some((c) =>
      c.parsed.raw.includes(BREAKING_COMMIT_MSG)
    )
    const releaseType: semver.ReleaseType = commits.features.length
      ? featuresHasBreaking
        ? "major" // 1.x.x
        : "minor" // x.1.x
      : "patch" // x.x.1

    const packageJson = await pkgJson.read(packages[pkgName])
    const oldVersion = packageJson.version!
    const newSemVer = semver.parse(semver.inc(oldVersion, releaseType))!

    packagesToRelease.push({
      name: pkgName,
      oldVersion,
      newVersion: `${newSemVer.major}.${newSemVer.minor}.${newSemVer.patch}`,
      changelog: createChangelog(commits),
      path: packages[pkgName],
    })
  }

  return packagesToRelease
}

function createChangelog(pkg: {
  features: any[]
  bugfixes: any[]
  other: any[]
}) {
  let changelog = `
# Changes
---
`
  if (pkg.features.length) {
    changelog += `
## Features

${pkg.features.map((c) => `  - ${c.parsed.raw}`).join("\n")}`
  }
  if (pkg.bugfixes.length) {
    changelog += `
## Bug Fixes

${pkg.bugfixes.map((c) => `  - ${c.parsed.raw}`).join("\n")}`
  }
  if (pkg.other.length) {
    changelog += `
## Other

${pkg.other.map((c) => `  - ${c.parsed.raw}`).join("\n")}`
  }

  return changelog
}
