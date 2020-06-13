// Placeholder for schema test (will use test framework, this is temporary)
const fs = require('fs')
const path = require('path')
const mysql = require('mysql')

const Adapters = require('../adapters')

const TABLES = ['user', 'account', 'session', 'verification_request']
const SCHEMA_FILE = path.join(__dirname, '/schemas/mysql.json')

function printSchema() {
  return new Promise(async (resolve) => {
    // Invoke adapter to sync schema
    const adapter = Adapters.Default('mysql://nextauth:password@127.0.0.1:3306/nextauth?synchronize=true')
    await adapter.getAdapter()

    const connection = mysql.createConnection({
      host: '127.0.0.1',
      user: 'nextauth',
      password: 'password',
      database: 'nextauth',
      port: 3306,
      multipleStatements: true
    })

    connection.connect()
    connection.query(
      TABLES.map(table => `DESCRIBE ${table}`).join(';'),
      (error, result) => {
        if (error) { throw error }

        const getColumnSchema  = (column) => {
          return {
            name: column.Field,
            type: column.Type,
            nullable: !!column.Null === "YES",
            default: column.Default
          }
        }

        let user = {}
        let account = {}
        let session = {}
        let verification_request = {}

        result[0].forEach(column => { user[column.Field] = getColumnSchema(column) })
        result[1].forEach(column => { account[column.Field] = getColumnSchema(column) })
        result[2].forEach(column => { session[column.Field] = getColumnSchema(column) })
        result[3].forEach(column => { verification_request[column.Field] = getColumnSchema(column) })

        connection.end()

        resolve({ user, account, session, verification_request })
      }
    )
  })
}

(async () => {
  const testSchema = JSON.stringify(await printSchema(), null, 2)
  const expectedSchema = fs.readFileSync(SCHEMA_FILE)

  // Uncomment to update fixture
  //fs.writeFileSync(SCHEMA_FILE, testSchema)

  if (testSchema == expectedSchema) {
    console.log("MySQL schema ok")
    process.exit()
  } else {
    console.error("MySQL schema error")
    process.exit(1)
  }
})()