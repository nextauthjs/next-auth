export interface InternalUrl {
  origin: string
  host: string
  /** @default "/api/auth" */
  path: string
  base: string
  toString: () => string
}

/** Returns an `URL` like object to make requests/redirects from server-side */
export default function parseUrl(plain?: string): InternalUrl {
  if(!plain) {
    throw new Error("url is empty, please check environment variables (ex NEXTAUTH_URL, NEXTAUTH_URL, NEXTAUTH_URL_INTERNAL...)")
  }
  const _url = new URL(plain)
  const path = (_url.pathname === "/" ? '/api/auth' : _url.pathname)
    // Remove trailing slash
    .replace(/\/$/, "")

  const base = `${_url.origin}${path}`

  return {
    origin: _url.origin,
    host: _url.host,
    path,
    base,
    toString: () => base,
  }
}
