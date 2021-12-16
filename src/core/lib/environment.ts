/**
 * Environment variable helper that first tries to get the configuration variables from public variables
 * (prefixed with NEXT_PUBLIC_), and falls back to process variables
 */

export const environment = {
    authUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL ?? process.env.NEXTAUTH_URL,
    internalAuthUrl: process.env.NEXT_PUBLIC_NEXTAUTH_URL_INTERNAL ?? process.env.NEXTAUTH_URL_INTERNAL,
    vercelUrl: process.env.NEXT_PUBLIC_VERCEL_URL ?? process.env.VERCEL_URL
}
