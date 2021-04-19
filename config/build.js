const fs = require("fs-extra")
const path = require("path")

const MODULE_ENTRIES = {
  SERVER: "index",
  CLIENT: "client",
  PROVIDERS: "providers",
  ADAPTERS: "adapters",
  JWT: "jwt",
}

const BUILD_TARGETS = {
  [`${MODULE_ENTRIES.SERVER}.js`]: "module.exports = require('./dist/server').default\n",
  [`${MODULE_ENTRIES.CLIENT}.js`]: "module.exports = require('./dist/client').default\n",
  [`${MODULE_ENTRIES.ADAPTERS}.js`]: "module.exports = require('./dist/adapters').default\n",
  [`${MODULE_ENTRIES.PROVIDERS}.js`]: "module.exports = require('./dist/providers').default\n",
  [`${MODULE_ENTRIES.JWT}.js`]: "module.exports = require('./dist/lib/jwt').default\n",
}

Object.entries(BUILD_TARGETS).forEach(([target, content]) => {
  fs.writeFile(path.join(process.cwd(), target), content, (err) => {
    if (err) throw err
    console.log(`[build] created "${target}" in root folder`)
  })
})

const TYPES_TARGETS = [
  `${MODULE_ENTRIES.SERVER}.d.ts`,
  `${MODULE_ENTRIES.CLIENT}.d.ts`,
  `${MODULE_ENTRIES.ADAPTERS}.d.ts`,
  `${MODULE_ENTRIES.PROVIDERS}.d.ts`,
  `${MODULE_ENTRIES.JWT}.d.ts`,
  "internals",
]

TYPES_TARGETS.forEach((target) => {
  fs.copy(
    path.resolve("types", target),
    path.join(process.cwd(), target),
    (err) => {
      if (err) throw err
      console.log(`[build-types] copying "${target}" to root folder`)
    }
  )
})
