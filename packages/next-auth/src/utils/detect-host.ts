/** Extract the host from the environment */
export function getURL(
  url: string | undefined | null,
  trusted: boolean | undefined = !!(
    process.env.AUTH_TRUST_HOST ?? process.env.VERCEL
  ),
  forwardedValue: string | string[] | undefined | null
): URL | Error {
  try {
    let host =
      process.env.NEXTAUTH_URL ??
      (process.env.NODE_ENV !== "production" && "http://localhost:3000")

    if (trusted && forwardedValue) {
      host = Array.isArray(forwardedValue) ? forwardedValue[0] : forwardedValue
    }

    if (!host) throw new TypeError("Invalid host")

    return new URL(url ?? "", new URL(host))
  } catch (error) {
    return error as Error
  }
}
