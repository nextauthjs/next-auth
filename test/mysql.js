/* eslint-disable */
// Placeholder for schema test (will use test framework, this is temporary)
const fs = require('fs')
const path = require('path')
const mysql = require('mysql')

const { compareSchemas } = require('./lib/db')
const Adapters = require('../adapters')

const TABLES = ['users', 'accounts', 'sessions', 'verification_requests']
const SCHEMA_FILE = path.join(__dirname, '/fixtures/schemas/mysql.json')

function printSchema () {
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

        const getColumnSchema = (column) => {
          const nullable = column.Null === 'YES' ? true : false
          return {
            type: column.Type,
            nullable,
            default: nullable ? column.Default : undefined
          }
        }

        const users = {}
        const accounts = {}
        const sessions = {}
        const verification_requests = {}

        result[0].forEach(column => { users[column.Field] = getColumnSchema(column) })
        result[1].forEach(column => { accounts[column.Field] = getColumnSchema(column) })
        result[2].forEach(column => { sessions[column.Field] = getColumnSchema(column) })
        result[3].forEach(column => { verification_requests[column.Field] = getColumnSchema(column) })

        connection.end()

        resolve({ users, accounts, sessions, verification_requests })
      }
    )
  })
}

(async () => {
  const expectedSchema = JSON.parse(fs.readFileSync(SCHEMA_FILE))
  const testResultSchema = await printSchema()
  const compareResult = compareSchemas(expectedSchema, testResultSchema)
  if (compareResult === true) {
    console.log('MySQL schema ok')
    process.exit()
  } else {
    console.error('MySQL schema errors')
    compareResult.forEach(error => console.log(`  * ${error}`))
    console.log('MySQL schema found:', JSON.stringify(testResultSchema, null, 2))
    process.exit(1)
  }
})()
