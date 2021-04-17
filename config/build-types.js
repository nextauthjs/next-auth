const fs = require('fs-extra')
const path = require('path')

const BUILD_TARGETS = [
  'index.d.ts',
  'client.d.ts',
  'adapters.d.ts',
  'providers.d.ts',
  'jwt.d.ts'
]

BUILD_TARGETS.forEach((target) => {
  fs.copyFile(
    path.resolve('types', target),
    path.join(process.cwd(), target),
    (err) => {
      if (err) throw err
      console.log(`[build-types] copying "${target}" to root folder`)
    }
  )
})

fs.copy(
  path.join(process.cwd(), 'types', 'internals'),
  path.join(process.cwd(), 'internals'),
  (err) => {
    if (err) throw err
    console.log('[build-types] copying "internals" to root folder')
  }
)
