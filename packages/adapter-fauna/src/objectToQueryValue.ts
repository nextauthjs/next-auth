import { QueryValue, TimeStub } from "fauna"

export const objectToQueryValue = (object: {
  [key: string]: any
}): QueryValue => {
  return Object.entries(object).reduce<{
    [key: string]: QueryValue
  }>((acc, [key, value]) => {
    if (value instanceof Date) {
      return {
        ...acc,
        [key]: TimeStub.fromDate(value),
      }
    }

    if (typeof value === "string" && !isNaN(Date.parse(value))) {
      return {
        ...acc,
        [key]: TimeStub.from(value),
      }
    }

    if (typeof value === "object" &&
      value !== null &&
      !Array.isArray(value)) {
      return {
        ...acc,
        [key]: objectToQueryValue(value),
      }
    }

    return {
      ...acc,
      [key]: value ?? null,
    }
  }, {})
}
