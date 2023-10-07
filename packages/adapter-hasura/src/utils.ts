export type NonNullify<T> = {
  [K in keyof T]: T[K] extends null | infer U ? U : T[K]
}

type FormatToJS<T, K extends keyof T> = T[K] extends string
  ? Omit<T, K> & Record<K, Date>
  : Omit<T, K> & Record<K, Date | null>

type FormatToDatabase<T, K extends keyof T> = T[K] extends Date
  ? Omit<T, K> & Record<K, string>
  : Omit<T, K> & Record<K, string | null>

export function formatDateConversion<T, K extends keyof T>(
  object: T,
  key: K,
  direction: "toJS"
): FormatToJS<T, K>

export function formatDateConversion<T, K extends keyof T>(
  object: T,
  key: K,
  direction: "toDatabase"
): FormatToDatabase<T, K>

export function formatDateConversion<T, K extends keyof T>(
  object: T,
  key: K,
  direction: "toJS" | "toDatabase"
) {
  if (!object) return object

  const value = object[key]

  if (value === undefined) return object

  if (direction === "toJS") {
    return {
      ...object,
      [key]: value ? new Date(value as string) : null,
    } as FormatToJS<T, K>
  } else {
    return {
      ...object,
      [key]: value ? (value as unknown as Date).toISOString() : null,
    } as FormatToDatabase<T, K>
  }
}
