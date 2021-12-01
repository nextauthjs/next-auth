const fs = require("fs-extra")
const path = require("path")
const core = require("@actions/core")

try {
  const packageJSONPath = path.join(process.cwd(), "package.json")
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf8"))

  const sha8 = process.env.GITHUB_SHA.substr(0, 8)
  const prNumber = process.env.PR_NUMBER

  const packageVersion = `0.0.0-pr.${prNumber}.${sha8}`
  packageJSON.version = packageVersion
  core.setOutput("version", packageVersion)
  fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON))
} catch (error) {
  core.setFailed(error.message)
}
