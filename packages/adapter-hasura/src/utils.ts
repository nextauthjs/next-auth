// https://github.com/honeinc/is-iso-date/blob/master/index.js
const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/

function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value))
}

export const format = {
  from<T extends Record<string, any> | null>(
    data?: T
  ): T extends null ? null : T {
    if (!data) return null as any
    const newObject: Record<string, unknown> = {}
    for (const key in data) {
      const value = data[key]
      if (isDate(value)) {
        newObject[key] = new Date(value)
      } else {
        newObject[key] = value
      }
    }

    return newObject as any
  },
}
