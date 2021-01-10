import { createHash } from 'crypto'

/**
 * Secret used salt cookies and tokens (e.g. for CSRF protection).
 * If no secret option is specified then it creates one on the fly
 * based on options passed here. A options contains unique data, such as
 * OAuth provider secrets and database credentials it should be sufficent.
 */
export default function createSecret ({ userOptions, basePath, baseUrl }) {
  return userOptions.secret || createHash('sha256').update(JSON.stringify({
    baseUrl, basePath, ...userOptions
  })).digest('hex')
}
