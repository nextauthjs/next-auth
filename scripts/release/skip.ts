export function shouldSkip(options: { releaseBranches: string[] }) {
  if (!process.env.CI) {
    return false
  }
  const { releaseBranches } = options

  const branch = process.env.GITHUB_REF_NAME
  if (!branch || !releaseBranches.includes(branch)) {
    console.log(`\nSkipping release for branch "${branch}"`)
    console.log(
      `Releases are only triggered for the following branches: ${releaseBranches.join(
        ", "
      )}\n`
    )
    return true
  }
  return false
}
