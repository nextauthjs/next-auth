/** Extract the host from the environment */
export function detectHost(
  trusted: boolean,
  forwardedValue: string | string[] | undefined | null,
  defaultValue: string | false
): string | undefined {
  if (trusted && forwardedValue) {
    return Array.isArray(forwardedValue) ? forwardedValue[0] : forwardedValue
  }

  return defaultValue || undefined
}
