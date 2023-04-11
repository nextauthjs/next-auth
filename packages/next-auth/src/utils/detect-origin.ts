/** Extract the origin from the environment */
export function detectOrigin(forwardedHost: any, protocol: any) {
  // If we detect a Vercel environment, we can trust the host
  if (process.env.VERCEL ?? process.env.AUTH_TRUST_HOST) {
    protocol = ["http", "https"].includes(protocol) ? protocol : "https"
    return `${protocol}://${forwardedHost}`
  }
  // If `NEXTAUTH_URL` is `undefined` we fall back to "http://localhost:3000"
  return process.env.NEXTAUTH_URL
}
