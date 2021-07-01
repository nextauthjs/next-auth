const fs = require("fs-extra")
const path = require("path")

try {
  const packageJSONPath = path.join(process.cwd(), "package.json")
  const packageJSON = JSON.parse(fs.readFileSync(packageJSONPath, "utf8"))

  const sha8 = process.env.GITHUB_SHA.substr(0, 8)
  const prNumber = process.env.PR_NUMBER

  packageJSON.version = `0.0.0-pr.${prNumber}.${sha8}`

  fs.writeFileSync(packageJSONPath, JSON.stringify(packageJSON))
} catch (error) {
  console.error("Could not set PR version", error)
  process.exit(1)
}
