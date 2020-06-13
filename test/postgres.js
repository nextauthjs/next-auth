// Placeholder for schema test (will use test framework, this is temporary)
const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

const Adapters = require('../adapters')

const TABLES = ['user', 'account', 'session', 'verification_request']
const SCHEMA_FILE = path.join(__dirname, '/schemas/postgres.json')

function printSchema() {
  return new Promise(async (resolve) => {
    // Invoke adapter to sync schema
    const adapter = Adapters.Default('postgres://nextauth:password@127.0.0.1:5432/nextauth?synchronize=true')
    await adapter.getAdapter()

    const connection = new Client({
      host: '127.0.0.1',
      user: 'nextauth',
      password: 'password',
      database: 'nextauth',
      port: 5432
    })

    connection.connect()
    connection.query(
      TABLES.map(table => `SELECT column_name, data_type, character_maximum_length, is_nullable, column_default FROM INFORMATION_SCHEMA.COLUMNS WHERE table_name = '${table}' ORDER BY ordinal_position`).join(';'),
      (error, result) => {
        if (error) { throw error }

        const getColumnSchema  = (column) => {
          return {
            name: column.column_name,
            type: column.data_type,
            nullable: !!column.is_nullable === "YES",
            default: column.column_default
          }
        }
        

        let user = {}
        let account = {}
        let session = {}
        let verification_request = {}

        result[0].rows.forEach(column => { user[column.column_name] = getColumnSchema(column) })
        result[1].rows.forEach(column => { account[column.column_name] = getColumnSchema(column) })
        result[2].rows.forEach(column => { session[column.column_name] = getColumnSchema(column) })
        result[3].rows.forEach(column => { verification_request[column.column_name] = getColumnSchema(column) })

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
    console.log("Postgres schema ok")
    process.exit()
  } else {
    console.error("Postgres schema error")
    process.exit(1)
  }
})()
