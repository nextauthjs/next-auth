const fs = require('fs-extra')
const path = require('path')

const BUILD_TARGETS = {
  'index.js': "module.exports = require('./dist/server').default\n",
  'client.js': "module.exports = require('./dist/client').default\n",
  'adapters.js': "module.exports = require('./dist/adapters').default\n",
  'providers.js': "module.exports = require('./dist/providers').default\n",
  'jwt.js': "module.exports = require('./dist/lib/jwt').default\n"
}

Object.entries(BUILD_TARGETS).forEach(([target, content]) => {
  fs.writeFile(
    path.join(process.cwd(), target),
    content,
    (err) => {
      if (err) throw err
      console.log(`[build] created "${target}" in root folder`)
    }
  )
})

const TYPES_TARGETS = [
  'index.d.ts',
  'client.d.ts',
  'adapters.d.ts',
  'providers.d.ts',
  'jwt.d.ts',
  'internals'
]

TYPES_TARGETS.forEach((target) => {
  fs.copy(
    path.resolve('types', target),
    path.join(process.cwd(), target),
    (err) => {
      if (err) throw err
      console.log(`[build-types] copying "${target}" to root folder`)
    }
  )
})
