/** Extract the host from the environment */
export function detectHost(forwardedHost: any) {
  if (process.env.VERCEL ?? process.env.AUTH_TRUST_HOST) return forwardedHost

  return process.env.NEXTAUTH_URL ?? process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : undefined
}
