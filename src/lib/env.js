/**
 * Returns `NEXTAUTH_URL` environment variable
 *
 * @returns {string}
 */
export function getNextAuthUrl () {
  // Return existing value from env if exists
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  return null
}
