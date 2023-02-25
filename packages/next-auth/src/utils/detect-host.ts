/** Extract the host from the environment */
export function detectHost(forwardedHost: any) {
  // if `NEXTAUTH_URL_INTERNAL` is set, it means NextAuth.js is deployed 
  // behind a proxy - we prioritize it over `forwardedHost`.
  if (process.env.NEXTAUTH_URL_INTERNAL) {
    return process.env.NEXTAUTH_URL_INTERNAL
  }
  // If we detect a Vercel environment, we can trust the host
  if (process.env.VERCEL ?? process.env.AUTH_TRUST_HOST)
    return forwardedHost
  // If `NEXTAUTH_URL` is `undefined` we fall back to "http://localhost:3000"
  return process.env.NEXTAUTH_URL
}
