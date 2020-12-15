import logger from './logger'

/**
 * Simple universal (client/server) function to split host and path.
 * It can also take a url (either URL or a string) and parses it correctly.
 * @returns {URL}
 */
function baseUrl (url) {
  let _url = url || process.env.NEXTAUTH_URL || process.env.VERCEL_URL
  if (typeof _url !== 'string' && !(_url instanceof URL)) {
    throw new Error('baseUrl must be either a valid URL object or a valid string URL')
  }
  const defaultUrl = 'http://localhost:3000/api/auth'
  _url = _url || defaultUrl
  try {
    const parsedUrl = new URL(_url)
    if (parsedUrl.pathname === '/') {
      parsedUrl.pathname = '/api/auth'
    }
    parsedUrl.pathname = parsedUrl.pathname.replace(/\/$/, '')
    parsedUrl.href = parsedUrl.href.replace(/\/$/, '')

    return parsedUrl
  } catch (error) {
    logger.error('INVALID_URL', _url, error)
    return new URL(defaultUrl)
  }
}

export default baseUrl
