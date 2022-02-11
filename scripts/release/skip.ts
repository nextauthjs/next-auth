export function shouldSkip(options: { releaseBranches: string[] }) {
  const { releaseBranches } = options

  if (!releaseBranches.includes(process.env.GITHUB_REF_NAME)) {
    console.log(
      `\nSkipping release for branch "${process.env.GITHUB_REF_NAME}"`
    )
    console.log(
      `Release is only triggered for the following branches: ${releaseBranches.join(
        ", "
      )}\n`
    )
    return true
  }
  return false
}
