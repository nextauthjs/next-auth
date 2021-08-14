const fs = require("fs-extra")
const path = require("path")

const MODULE_ENTRIES = {
  SERVER: "index",
  REACT: "react",
  ADAPTERS: "adapters",
  JWT: "jwt",
}

// Building submodule entries

const BUILD_TARGETS = {
  [`${MODULE_ENTRIES.SERVER}.js`]:
    "module.exports = require('./dist/server').default\n",
  [`${MODULE_ENTRIES.REACT}.js`]:
    "module.exports = require('./dist/client/react').default\n",
  [`${MODULE_ENTRIES.JWT}.js`]:
    "module.exports = require('./dist/lib/jwt').default\n",
}

Object.entries(BUILD_TARGETS).forEach(([target, content]) => {
  fs.writeFile(path.join(process.cwd(), target), content, (err) => {
    if (err) throw err
    console.log(`[build] created "${target}" in root folder`)
  })
})

// Building types
fs.mkdirSync("providers", { recursive: true })

const TYPES_TARGETS = [
  `${MODULE_ENTRIES.SERVER}.d.ts`,
  `${MODULE_ENTRIES.REACT}-client.d.ts`,
  `${MODULE_ENTRIES.ADAPTERS}.d.ts`,
  "providers",
  `${MODULE_ENTRIES.JWT}.d.ts`,
  "internals",
]

TYPES_TARGETS.forEach((target) => {
  fs.copy(
    path.resolve("types", target),
    path.join(
      process.cwd(),
      target.startsWith("react-client") ? "react.d.ts" : target
    ),
    (err) => {
      if (err) throw err
      console.log(`[types] copying "${target}" to root folder`)
    }
  )
})

// Generate provider types

const providersDirPath = path.join(process.cwd(), "/src/providers")

const oauthProviderFiles = fs
  .readdirSync(providersDirPath, "utf8")
  .filter((f) => f !== "credentials.js" && f !== "email.js")

let type = `export type OAuthProviderType =\n`

oauthProviderFiles.forEach((file) => {
  const provider = fs.readFileSync(path.join(providersDirPath, file), "utf8")
  const fileName = file.split(".")[0]
  try {
    // NOTE: If this fails, the default export probably wasn't a named function.
    // Always use a named function as default export.
    // Eg.: export default function YourProvider ...
    const { functionName } = provider.match(
      /export default function (?<functionName>.+)\s?\(/
    ).groups

    type += `  | "${functionName}"\n`
    const providerModule = `import { OAuthConfig } from "."

declare module "next-auth/providers/${fileName}" {
  export default function ${functionName}Provider(
    options: Partial<OAuthConfig>
  ): OAuthConfig
}
`

    fs.writeFile(
      path.join("types/providers", `${fileName}.d.ts`),
      providerModule
    )

    console.log(
      `[types] created module declaration for "${functionName}" provider`
    )
  } catch (error) {
    console.error(
      [
        `\nThe provider file '${file}' should have a single named default export`,
        "Example: 'export default function YourProvider'\n\n",
      ].join("\n")
    )
    process.exit(1)
  }
})

fs.writeFile(
  path.join(process.cwd(), "types/providers/oauth-providers.d.ts"),
  type
)
