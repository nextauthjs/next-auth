import type { Commit, PackageToRelease } from "./types"
import type { PackageJson } from "type-fest"

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

export async function analyze(options: {
  dryRun: boolean
  packages: Record<string, string>
  BREAKING_COMMIT_MSG: string
  RELEASE_COMMIT_MSG: string
  RELEASE_COMMIT_TYPES: string[]
  rootDir: string
  SKIP_CI_COMMIT_MSG: string
}): Promise<PackageToRelease[]> {
  const {
    packages,
    BREAKING_COMMIT_MSG,
    RELEASE_COMMIT_MSG,
    RELEASE_COMMIT_TYPES,
    rootDir,
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

  console.log(commitsSinceLatestTag.length, `commits found since ${latestTag}`)

  const lastCommit = commitsSinceLatestTag[0]
  if (lastCommit.parsed.raw.includes(SKIP_CI_COMMIT_MSG)) {
    console.log(
      `Last commit contained ${SKIP_CI_COMMIT_MSG}, skipping skipping release...`
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

    return []
  }

  console.log()

  const packagesToRelease: PackageToRelease[] = []
  for (const pkgName in commitsByPackage) {
    const grouppedPackage = commitsByPackage[
      pkgName as keyof typeof commitsByPackage
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
    const releaseType: semver.ReleaseType = grouppedPackage.features.length
      ? featuresHasBreaking
        ? "major" // 1.x.x
        : "minor" // x.1.x
      : grouppedPackage.bugfixes.length
      ? "patch" // x.x.1
      : "prerelease" // x.x.x-prerelease.1

    const file = path.join(rootDir, packages[pkgName], "package.json")
    const packageJson = (await jsonfile.readFile(file)) as PackageJson
    const oldVersion = packageJson.version!
    const newSemVer = semver.parse(semver.inc(oldVersion, releaseType))!

    packagesToRelease.push({
      name: pkgName,
      oldVersion,
      newVersion: `${newSemVer.major}.${newSemVer.minor}.${newSemVer.patch}`,
      changelog: createChangelog(grouppedPackage),
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
