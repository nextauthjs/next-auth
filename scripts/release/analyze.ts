import type { Commit, GroupedCommits, PackageToRelease } from "./types"

import { execSync } from "child_process"
import { debug, pkgJson } from "./utils"
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
  SKIP_RELEASE_MSG: string
}): Promise<PackageToRelease[]> {
  const {
    packages,
    BREAKING_COMMIT_MSG,
    RELEASE_COMMIT_MSG,
    RELEASE_COMMIT_TYPES,
    SKIP_RELEASE_MSG,
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
  debug(
    "Analyzing the following commits:",
    commitsSinceLatestTag.map((c) => `  ${c.subject}`).join("\n")
  )

  const lastCommit = commitsSinceLatestTag[0]
  if (lastCommit?.parsed.raw.includes(SKIP_RELEASE_MSG)) {
    console.log(
      `Last commit contained ${SKIP_RELEASE_MSG}, skipping release...`
    )
    return []
  }
  if (lastCommit?.parsed.raw === RELEASE_COMMIT_MSG) {
    debug("Already released...")
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

    for (const [pkg, src] of Object.entries(packages)) {
      if (
        changedFilesInCommit.some((changedFile) => changedFile.startsWith(src))
      ) {
        if (!(pkg in acc)) {
          acc[pkg] = { features: [], bugfixes: [], other: [], breaking: [] }
        }
        const { type } = commit.parsed
        if (RELEASE_COMMIT_TYPES.includes(type)) {
          if (!packagesNeedRelease.includes(pkg)) {
            packagesNeedRelease.push(pkg)
          }
          if (type === "feat") {
            acc[pkg].features.push(commit)
            if (commit.body.includes(BREAKING_COMMIT_MSG)) {
              acc[pkg].breaking.push({
                ...commit,
                body: commit.body.replace(BREAKING_COMMIT_MSG, "").trim(),
              })
            }
          } else acc[pkg].bugfixes.push(commit)
        } else {
          acc[pkg].other.push(commit)
        }
      }
    }
    return acc
  }, {} as Record<string, GroupedCommits>)

  if (packagesNeedRelease.length) {
    console.log(
      packagesNeedRelease.length,
      `new release(s) needed: ${packagesNeedRelease.join(", ")}`
    )
  } else {
    console.log("No packages needed a new release, BYE!")

    return []
  }

  console.log()

  const packagesToRelease: PackageToRelease[] = []
  for await (const pkgName of packagesNeedRelease) {
    const commits = grouppedPackages[pkgName]
    const releaseType: semver.ReleaseType = commits.breaking.length
      ? "major" // 1.x.x
      : commits.features.length
      ? "minor" // x.1.x
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

function createChangelog(pkg: GroupedCommits) {
  let changelog = ``
  changelog += listGroup("Features", pkg.features)
  changelog += listGroup("Bugfixes", pkg.bugfixes)
  changelog += listGroup("Other", pkg.other)

  if (pkg.breaking.length) {
    changelog += `
## BREAKING CHANGES

${pkg.breaking.map((c) => `  - ${c.body}`).join("\n")}`
  }

  return changelog
}

function sortByScope(commits: Commit[]) {
  return commits.sort((a, b) => {
    if (a.parsed.scope && b.parsed.scope) {
      return a.parsed.scope.localeCompare(b.parsed.scope)
    } else if (a.parsed.scope) return -1
    else if (b.parsed.scope) return 1
    return a.body.localeCompare(b.body)
  })
}

function header(c: Commit) {
  let h = c.parsed.subject
  if (c.parsed.scope) {
    h = `**${c.parsed.scope}**: ${h} (${c.commit.short})`
  }
  return h
}

function listGroup(heading: string, commits: Commit[]) {
  if (!commits.length) return ""
  const list = sortByScope(commits)
    .map((c) => `  - ${header(c)}`)
    .join("\n")
  return `## ${heading}

${list}
`
}
