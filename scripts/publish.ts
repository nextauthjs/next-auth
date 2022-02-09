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

const rootDir = path.resolve(__dirname, "..")

const releaseCommitMsg = 'chore(release): "bump version"'
const skipCI = "[skip ci]"

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
  // TODO: Generate this from the package.json
  const packages = {
    "next-auth": "packages/next-auth",
    "@next-auth/prisma-adapter": "packages/adapter-prisma",
    "next-auth-docs": "docs",
  }

  const packageFolders = Object.values(packages)

  // Get the latest tag
  const latestTag = execSync("git describe --tags --abbrev=0").toString().trim()

  console.log()

  async function getCommitsSinceLatestTag(latestTag: string) {
    console.log(`Latest tag identified: ${latestTag}\n`)

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
    const packageCommits = commits.filter(({ commit }) => {
      const changedFiles = getChangedFiles(commit.short)
      return packageFolders.some((packageFolder) =>
        changedFiles.some((changedFile) =>
          changedFile.startsWith(packageFolder)
        )
      )
    })

    console.log(packageCommits.length, "touched package code")

    return packageCommits
  }

  // 1. Get a list of commits since the last tag
  const commitsSinceLatestTag = await getCommitsSinceLatestTag(latestTag)

  // 2. Early bailout ([skip ci] or chore(release): "bump version")
  // TODO:

  // 3. Filter out commits that did not touch package code
  const packageCommits = getPackageCommits(
    commitsSinceLatestTag,
    packageFolders
  )

  console.log()

  // 4. Group commits by package
  const commitsByPackage = packageCommits.reduce((acc, commit) => {
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

  console.log(
    Object.keys(commitsByPackage).length,
    `packages need a new release: ${Object.keys(commitsByPackage).join(", ")}`
  )

  // 5. For each package
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

    // 5.2. Determine the next version
    const releaseType: semver.ReleaseType = grouppedPackage.features.length
      ? grouppedPackage.features.some((c) =>
          c.parsed.raw.includes("BREAKING CHANGE")
        )
        ? "major"
        : "minor"
      : grouppedPackage.bugfixes.length
      ? "patch"
      : "prerelease"

    // 5.3. Update package.json with the new version
    const file = path.join(
      rootDir,
      packages[packageName as keyof typeof packages],
      "package.json"
    )
    const packageJson = (await jsonfile.readFile(file)) as PackageJson

    const oldVersion = semver.parse(packageJson.version)!

    const newSemVer = semver.parse(semver.inc(oldVersion, releaseType))!
    const newVersion = `${newSemVer.major}.${newSemVer.minor}.${newSemVer.patch}`
    await jsonfile.writeFile(
      file,
      { ...packageJson, version: newVersion },
      { spaces: 2 }
    )

    // 5.4. Create the changelog
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

    console.log("\n=========================\n")

    console.log(`${packageName}@${newVersion}`, "\n", changelog)
    // 5.5. Create git tag/release
  }

  // 6. Commit changes
  // 7. Push git tag/release/commits
  // 8. Push to npm

  return
}

run().catch((err) => {
  console.log(err)
  process.exit(1)
})
