/* eslint-disable */
// Placeholder for schema test (will use test framework, this is temporary)
const Adapters = require('../adapters')

;(async () => {
  try {
    // We can't connection a local MongoDB SRV instance but we can at least see if the URLs cause an error
    Adapters.Default('mongodb+srv://nextauth:password@127.0.0.1/nextauth?ssl=false&retryWrites=true')

    // Connect to local MongoDB instance
    // Note: MongoDB doesn't thrown a connection error right away if is a 
    // problem with the credentials or host configuration, but after a few
    // seconds it throws a Timeout error (which is caught by the adapter).
    const adapter = Adapters.Default('mongodb://nextauth:password@127.0.0.1:27017/nextauth?synchronize=true')
    await adapter.getAdapter()

    // @TODO create objects in database, check format of objects returned

    console.log('MongoDB loaded ok')
    process.exit()
  } catch (error) {
    console.error('MongoDB error', error)
    process.exit(1)
  }
})()
