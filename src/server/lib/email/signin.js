import { randomBytes } from 'crypto'

export default async (email, options, provider) => {
  try {
    const { urlPrefix, adapter } = options
    const { from, server, port, secure, username, password } = provider

    const _adapter = await adapter.getAdapter()
    const { createInvite } = _adapter

    // Prefer provider specific secret, but use default secret if none specified
    const secret = provider.secret || options.secret

    // Generate token
    const token = randomBytes(32).toString('hex')

    // @TODO Create invite (send secret so can be hashed)
    // await createInvite(email, token, secret)

    // Send email with link containing token (the unhashed version)
    const url = `${urlPrefix}/callback/${encodeURIComponent(provider.id)}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`

    // Return promise
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}
