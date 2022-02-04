// https://github.com/honeinc/is-iso-date/blob/master/index.js
const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/
function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value))
}

export const format = {
  /** Takes a plain old JavaScript object and turns it into a Dynamodb object */
  to(object: Record<string, any>) {
    const newObject: Record<string, unknown> = {}
    for (const key in object) {
      const value = object[key]
      if (value instanceof Date) {
        // DynamoDB requires the TTL attribute be a UNIX timestamp (in secs).
        if (key === "expires") newObject[key] = value.getTime() / 1000
        else newObject[key] = value.toISOString()
      } else newObject[key] = value
    }
    return newObject
  },
  /** Takes a Dynamo object and returns a plain old JavaScript object */
  from<T = Record<string, unknown>>(object?: Record<string, any>): T | null {
    if (!object) return null
    const newObject: Record<string, unknown> = {}
    for (const key in object) {
      // Filter DynamoDB specific attributes so it doesn't get passed to core,
      // to avoid revealing the type of database
      if (["pk", "sk", "GSI1PK", "GSI1SK"].includes(key)) continue

      const value = object[key]

      if (isDate(value)) newObject[key] = new Date(value)
      // hack to keep type property in account
      else if (key === "type" && ["SESSION", "VT", "USER"].includes(value))
        continue
      // The expires property is stored as a UNIX timestamp in seconds, but
      // JavaScript needs it in milliseconds, so multiply by 1000.
      else if (key === "expires" && typeof value === "number")
        newObject[key] = new Date(value * 1000)
      else newObject[key] = value
    }
    return newObject as T
  },
}

export function generateUpdateExpression(object: Record<string, any>): {
  UpdateExpression: string
  ExpressionAttributeNames: Record<string, string>
  ExpressionAttributeValues: Record<string, unknown>
} {
  const formatedSession = format.to(object)
  let UpdateExpression = "set"
  const ExpressionAttributeNames: Record<string, string> = {}
  const ExpressionAttributeValues: Record<string, unknown> = {}
  for (const property in formatedSession) {
    UpdateExpression += ` #${property} = :${property},`
    ExpressionAttributeNames["#" + property] = property
    ExpressionAttributeValues[":" + property] = formatedSession[property]
  }
  UpdateExpression = UpdateExpression.slice(0, -1)
  return {
    UpdateExpression,
    ExpressionAttributeNames,
    ExpressionAttributeValues,
  }
}
