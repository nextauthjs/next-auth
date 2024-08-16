const fs = require("fs")
const path = require("path")
const core = require("@actions/core")

try {
  const packageJSONPath = path.join(
    process.cwd(),
    `packages/${process.env.PACKAGE_PATH || "next-auth"}/package.json`
  )
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf8"))

  const sha8 = process.env.GITHUB_SHA.substring(0, 8)
  const prefix = "0.0.0-"
  const pr = process.env.PR_NUMBER
  const source = pr ? `pr.${pr}` : "manual"
  const packageVersion = `${prefix}${source}.${sha8}`
  packageJSON.version = packageVersion
  core.setOutput("version", packageVersion)
  fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON))
} catch (error) {
  core.setFailed(error.message)
}
