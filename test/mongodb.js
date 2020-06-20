/* eslint-disable */
// Placeholder for schema test (will use test framework, this is temporary)
const Adapters = require('../adapters')

;(async () => {
  try {
    const adapter1 = Adapters.Default('mongodb+srv://nextauth:password@127.0.0.1:27017/nextauth?ssl=true&replicaSet=some-shard-0&authSource=admin&retryWrites=true')
    await adapter1.getAdapter()

    const adapter2 = Adapters.Default('mongodb://nextauth:password@127.0.0.1:27017/nextauth?synchronize=true')
    await adapter2.getAdapter()

    console.log('MongoDB loaded ok')
    process.exit()
  } catch (error) {
    console.error('MongoDB error', error)
    process.exit(1)
  }
})()
