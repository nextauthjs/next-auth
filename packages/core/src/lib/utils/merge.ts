function isObject(item: unknown): item is object {
  return item !== null && typeof item === "object"
}

/** Deep merge two or more objects */
export function merge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Array<Record<string, unknown> | undefined>
): T & Record<string, unknown> {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!isObject(target[key]))
          (target as Record<string, unknown>)[key] = Array.isArray(source[key])
            ? []
            : {}
        merge(
          (target as Record<string, unknown>)[key] as T,
          source[key] as Record<string, unknown>
        )
      } else if (source[key] !== undefined)
        (target as Record<string, unknown>)[key] = source[key]
    }
  }

  return merge(target, ...sources)
}
