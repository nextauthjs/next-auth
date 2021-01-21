import getConfig from 'next/config'

/**
 * Returns `NEXTAUTH_URL` either via environment variable or Next.js runtime config
 *
 * @returns {string}
 */
export function getNextAuthUrl () {
  // Return from environment variable if exists
  if (process.env.NEXTAUTH_URL) {
    return process.env.NEXTAUTH_URL
  }

  // Use Next.js runtime config if exists
  const { publicRuntimeConfig } = getConfig()
  if (publicRuntimeConfig.NEXTAUTH_URL) {
    return publicRuntimeConfig.NEXTAUTH_URL
  }

  return null
}
