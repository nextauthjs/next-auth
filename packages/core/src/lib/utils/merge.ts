function isPlainObject(item: unknown): item is Record<string, unknown> {
  return (
    item !== null &&
    typeof item === "object" &&
    !Array.isArray(item) &&
    !(item instanceof Date) &&
    !(item instanceof RegExp) &&
    !(item instanceof Error) &&
    Object.prototype.toString.call(item) === "[object Object]"
  )
}

/** Deep merge two or more objects */
export function merge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Array<Record<string, unknown> | undefined>
): T & Record<string, unknown> {
  if (!sources.length) return target

  for (const source of sources) {
    if (!source) {
      continue
    }

    // Use Object.keys to avoid prototype pollution
    for (const key of Object.keys(source)) {
      const sourceValue = source[key]
      const targetValue = (target as Record<string, unknown>)[key]

      // Skip undefined values from source
      if (sourceValue === undefined) {
        continue
      }

      // If both values are plain objects, merge them recursively
      if (isPlainObject(targetValue) && isPlainObject(sourceValue)) {
        merge(
          targetValue as Record<string, unknown>,
          sourceValue as Record<string, unknown>
        )
      } else {
        // Otherwise, override the target value with the source value
        ;(target as Record<string, unknown>)[key] = sourceValue
      }
    }
  }

  return target as T & Record<string, unknown>
}
