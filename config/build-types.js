const fs = require('fs-extra')
const path = require('path')

const BUILD_TARGETS = [
  'index.d.ts',
  'client.d.ts',
  'adapters.d.ts',
  'providers.d.ts',
  'jwt.d.ts',
  'internals'
]

BUILD_TARGETS.forEach((target) => {
  fs.copy(
    path.resolve('types', target),
    path.join(process.cwd(), target),
    (err) => {
      if (err) throw err
      console.log(`[build-types] copying "${target}" to root folder`)
    }
  )
})
