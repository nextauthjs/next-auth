const path = require("path")
const fs = require("fs")

const snippetsPath = path.join(process.cwd(), "snippets")

const files = fs.readdirSync(snippetsPath, "utf8")

const result = {}
for (const file of files) {
  const snippet = fs.readFileSync(path.join(snippetsPath, file), "utf-8")
  const body = snippet
    .replace(/\n/g, "\n * ")
    .split("\n")
    .map((l) => (l === " * " ? " *" : l))
  body[0] = ` * ${body[0]}`
  body.unshift("/**")
  body.pop()
  body.push(" */")
  const name = file.replace(/\.md$/, "")
  result[name] = {
    description: `Snippet genereated from ${file} by pnpm \`generate-snippet\``,
    scope: "typescript",
    prefix: name,
    body,
  }
}

fs.writeFileSync(
  path.join(process.cwd(), "../.vscode/generated-snippets.code-snippets"),
  JSON.stringify(result, null, 2)
)
