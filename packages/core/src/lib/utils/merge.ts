function isObject(item: unknown): item is object {
  return item !== null && typeof item === "object"
}

// Arrays stay index-merged. Only plain objects are walked. A Date, a class
// instance, or any other object is kept by reference: walking it re-enters
// cyclic Nodemailer / AWS SES transports and overflows the stack
// (nextauthjs/next-auth#8540). A plain object or array already on this path
// is kept by reference for the same reason. Delete both guards when upstream
// merge does this.
function isPlainObject(item: unknown): item is Record<string, unknown> {
  if (!isObject(item) || Array.isArray(item)) return false
  const prototype = Object.getPrototypeOf(item)
  return prototype === Object.prototype || prototype === null
}

function mergeAlong<T extends Record<string, unknown>>(
  target: T,
  sources: Array<Record<string, unknown> | undefined>,
  path: Set<object>
): T & Record<string, unknown> {
  if (!sources.length) return target
  const source = sources.shift()

  if (isObject(target) && isObject(source) && !path.has(source)) {
    path.add(source)
    for (const key in source) {
      const value = (source as Record<string, unknown>)[key]
      if (isPlainObject(value) || Array.isArray(value)) {
        if (path.has(value)) {
          ;(target as Record<string, unknown>)[key] = value
        } else {
          if (!isObject(target[key]))
            (target as Record<string, unknown>)[key] = Array.isArray(value)
              ? []
              : {}
          mergeAlong(
            (target as Record<string, unknown>)[key] as T,
            [value as Record<string, unknown>],
            path
          )
        }
      } else if (value !== undefined) {
        ;(target as Record<string, unknown>)[key] = value
      }
    }
    path.delete(source)
  }

  return mergeAlong(target, sources, path)
}

/** Deep merge two or more objects */
export function merge<T extends Record<string, unknown>>(
  target: T,
  ...sources: Array<Record<string, unknown> | undefined>
): T & Record<string, unknown> {
  return mergeAlong(target, sources, new Set())
}
