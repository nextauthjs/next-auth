/** Object check including arrays */
function isObject(item: unknown): item is object {
  return item !== null && typeof item === "object"
}

/** Deep merge two or more objects */
export function merge<T extends Record<string, any>>(
  target: T,
  ...sources: Array<Record<string, any> | undefined>
): T & Record<string, any> {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!isObject(target[key]))
          (target as any)[key] = Array.isArray(source[key]) ? [] : {}
        merge(target[key], source[key])
      } else if (source[key] !== undefined) (target as any)[key] = source[key]
    }
  }

  return merge(target, ...sources)
}
