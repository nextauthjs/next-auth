import { randomBytes } from 'crypto'

export default async (email, provider, options) => {
  try {
    const { urlPrefix, adapter } = options
    const { createEmailVerification } = await adapter.getAdapter(options)

    // Prefer provider specific secret, but use default secret if none specified
    const secret = provider.secret || options.secret

    // Generate token
    const token = randomBytes(32).toString('hex')

    // Send email with link containing token (the unhashed version)
    const url = `${urlPrefix}/callback/${encodeURIComponent(provider.id)}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`

    // @TODO Create invite (send secret so can be hashed)
    await createEmailVerification(email, url, token, secret, provider, options)

    // Return promise
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}
