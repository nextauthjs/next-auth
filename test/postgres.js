/* eslint-disable */
// Placeholder for schema test (will use test framework, this is temporary)
const fs = require('fs')
const path = require('path')
const { Client } = require('pg')

const { compareSchemas } = require('./lib/db')
const Adapters = require('../adapters')

const TABLES = ['users', 'accounts', 'sessions', 'verification_requests']
const SCHEMA_FILE = path.join(__dirname, '/fixtures/schemas/postgres.json')

function printSchema () {
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

        const getColumnSchema = (column) => {
          const nullable = column.is_nullable === 'YES' ? true : false
          return {
            type: column.data_type,
            nullable,
            default: nullable ? column.column_default : undefined
          }
        }

        const users = {}
        const accounts = {}
        const sessions = {}
        const verification_requests = {}

        result[0].rows.forEach(column => { users[column.column_name] = getColumnSchema(column) })
        result[1].rows.forEach(column => { accounts[column.column_name] = getColumnSchema(column) })
        result[2].rows.forEach(column => { sessions[column.column_name] = getColumnSchema(column) })
        result[3].rows.forEach(column => { verification_requests[column.column_name] = getColumnSchema(column) })

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
    console.log('Postgres schema ok')
    process.exit()
  } else {
    console.error('Postgres schema errors')
    compareResult.forEach(error => console.log(`  * ${error}`))
    console.log('Postgres schema found:', JSON.stringify(testResultSchema, null, 2))
    process.exit(1)
  }
})()
