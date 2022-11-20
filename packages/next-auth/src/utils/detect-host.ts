/** Extract the host from the environment */
function detectHost(
  trusted: boolean | undefined,
  forwardedValue: string | string[] | undefined | null
): URL {
  let host =
    process.env.NEXTAUTH_URL ??
    (process.env.NODE_ENV !== "production" && "http://localhost:3000")
  if (trusted && forwardedValue) {
    host = Array.isArray(forwardedValue) ? forwardedValue[0] : forwardedValue
  }
  if (host) return new URL(host)
  throw new TypeError("Invalid URL")
}

export function getURL(
  url: string | undefined | null,
  ...args: Parameters<typeof detectHost>
): URL | Error {
  try {
    args[0] ??= Boolean(process.env.AUTH_TRUST_HOST ?? process.env.VERCEL)
    return new URL(url ?? "", detectHost(...args))
  } catch (error) {
    return error as Error
  }
}
