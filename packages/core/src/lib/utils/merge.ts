import isPlainObject from 'is-plain-obj';

/** Deep merge two objects */
export function merge(target: any, ...sources: any[]): any {
  if (!sources.length) return target
  const source = sources.shift()

  if (isPlainObject(target) && isPlainObject(source)) {
    for (const key in source) {
      if (isPlainObject(source[key])) {
        if (!target[key]) {
          target[key] = {}
        }

        merge(target[key], source[key])
      } else {
        target[key] = source[key]
      }
    }
  }

  return merge(target, ...sources)
}
