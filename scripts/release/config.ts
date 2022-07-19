const rootDir = process.cwd()

export const config = {
  releaseBranches: ["main"],
  // TODO: Read from pnpm-workspace.yaml
  packageDirectories: ["packages"],
  rootDir,
  BREAKING_COMMIT_MSG: "BREAKING CHANGE:",
  RELEASE_COMMIT_MSG: "chore(release): bump package version(s) [skip ci]",
  RELEASE_COMMIT_TYPES: ["feat", "fix"],
  dryRun:
    !process.env.CI ||
    !!process.env.DRY_RUN ||
    process.argv.includes("--dry-run"),
  verbose: !!process.env.VERBOSE || process.argv.includes("--verbose"),
}

export type ConfigType = typeof config
