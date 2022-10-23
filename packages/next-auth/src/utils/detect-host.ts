/** Extract the host from the environment */
export function detectHost(forwardedHost: any) {
  // If we detect a Vercel environment, we can trust the host
  if (process.env.VERCEL ?? process.env.AUTH_TRUST_HOST)
    return forwardedHost
  // If `NEXTAUTH_URL` is `undefined` we fall back to "http://localhost:3000"
  return process.env.NEXTAUTH_URL
}
