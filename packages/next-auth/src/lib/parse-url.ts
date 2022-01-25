export interface InternalUrl {
  /** @default "http://localhost:3000" */
  origin: string
  /** @default "localhost:3000" */
  host: string
  /** @default "/api/auth" */
  path: string
  /** @default "http://localhost:3000/api/auth" */
  base: string
  /** @default "http://localhost:3000/api/auth" */
  toString: () => string
}

/** Returns an `URL` like object to make requests/redirects from server-side */
export default function parseUrl(nextauthUrl?: string): InternalUrl {
  const defaultPathname = "/api/auth"

  const httpUrl = nextauthUrl.startsWith("http") ? nextauthUrl : (
    nextauthUrl.startsWith("localhost:")
      // probably don't want https on localhost:
      ? `http://${nextauthUrl}`
      : `https://${nextauthUrl}`
  )

  const urlObj = new URL(httpUrl)
  const path = (urlObj.pathname === "/" ? defaultPathname : urlObj.pathname)
    // Remove trailing slash
    .replace(/\/$/, "")

  const base = `${urlObj.origin}${path}`

  return {
    origin: urlObj.origin,
    host: urlObj.host,
    path,
    base,
    toString: () => base,
  }
}
