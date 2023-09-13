type RecursivelyReplaceNullWithUndefined<T> = T extends null
  ? undefined
  : T extends Array<infer U>
  ? Array<RecursivelyReplaceNullWithUndefined<U>>
  : T extends Record<string, unknown>
  ? { [K in keyof T]: RecursivelyReplaceNullWithUndefined<T[K]> }
  : T

/**
 * Replace all Null with undefined https://stackoverflow.com/a/72549576/4717424
 * @param obj T
 * @returns RecursivelyReplaceNullWithUndefined<T>
 */
export function nullsToUndefined<T>(
  obj: T
): RecursivelyReplaceNullWithUndefined<T> {
  if (obj === null || obj === undefined) {
    return undefined as any
  }

  if ((obj as any).constructor.name === "Object" || Array.isArray(obj)) {
    for (const key in obj) {
      obj[key] = nullsToUndefined(obj[key]) as any
    }
  }
  return obj as RecursivelyReplaceNullWithUndefined<T>
}

export const transformDate = <T extends Record<string, unknown>>(
  object: T,
  key: keyof T
): T => {
  if (!object) return object

  // if (object[key]) {
  return {
    ...object,
    [key]: object[key] ? new Date(object[key] as string) : null,
  }
  // }

  // return object;
}
