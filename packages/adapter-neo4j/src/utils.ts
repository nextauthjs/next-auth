import type { Session } from "neo4j-driver"
import { isInt, integer } from "neo4j-driver"

// https://github.com/honeinc/is-iso-date/blob/master/index.js
const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/

function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value))
}

export const format = {
  /** Takes a plain old JavaScript object and turns it into a Neo4j compatible object */
  to(object: Record<string, any>) {
    const newObject: Record<string, unknown> = {}
    for (const key in object) {
      const value = object[key]
      if (value instanceof Date) newObject[key] = value.toISOString()
      else newObject[key] = value
    }
    return newObject
  },
  /** Takes a Neo4j object and returns a plain old JavaScript object */
  from<T = Record<string, unknown>>(object?: Record<string, any>): T | null {
    const newObject: Record<string, unknown> = {}
    if (!object) return null
    for (const key in object) {
      const value = object[key]
      if (isDate(value)) {
        newObject[key] = new Date(value)
      } else if (isInt(value)) {
        if (integer.inSafeRange(value)) newObject[key] = value.toNumber()
        else newObject[key] = value.toString()
      } else {
        newObject[key] = value
      }
    }

    return newObject as T
  },
}

export function client(session: Session) {
  return {
    /** Reads values from the database */
    async read<T>(statement: string, values?: any): Promise<T | null> {
      const result = await session.readTransaction((tx) =>
        tx.run(statement, values)
      )

      return format.from<T>(result?.records[0]?.get(0)) ?? null
    },
    /**
     * Reads/writes values from/to the database.
     * Properties are available under `$data`
     */
    async write<T>(statement: string, values: T): Promise<any> {
      const result = await session.writeTransaction((tx) =>
        tx.run(statement, { data: format.to(values) })
      )

      return format.from<T>(result?.records[0]?.toObject())
    },
  }
}
