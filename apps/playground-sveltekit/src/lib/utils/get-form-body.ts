// https://dev.to/danawoodman/getting-form-body-data-in-your-sveltekit-endpoints-4a85
export default function getFormBody(
  body: FormData | null
): Record<string, any> {
  if (!body) return {}

  // @ts-expect-error: Entries property type missing
  return [...body.entries()].reduce((data, [k, v]) => {
    const value = v
    if (k in data)
      data[k] = Array.isArray(data[k]) ? [...data[k], value] : [data[k], value]
    else data[k] = value
    return data
  }, {})
}
