/** Extract the origin from the environment */
export function detectOrigin(forwardedHost: any, protocol: any) {
  // An explicitly configured `NEXTAUTH_URL` always takes precedence, even in
  // trusted-host mode (Vercel / `AUTH_TRUST_HOST`), so a configured canonical
  // URL is never overridden by the auto-detected forwarded host.
  if (process.env.NEXTAUTH_URL) return process.env.NEXTAUTH_URL

  // No canonical URL configured. On platforms known to set the host reliably
  // (Vercel) or when the deployer has opted into trusting the host
  // (`AUTH_TRUST_HOST`), derive the origin from the forwarded host.
  if (process.env.VERCEL ?? process.env.AUTH_TRUST_HOST)
    return `${protocol === "http" ? "http" : "https"}://${forwardedHost}`

  // `NEXTAUTH_URL` is `undefined` here; callers fall back to
  // "http://localhost:3000".
  return process.env.NEXTAUTH_URL
}
