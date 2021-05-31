import { createHash, randomBytes } from "crypto"
import adapterErrorHandler from "../../../adapters/error-handler"

/**
 * Starts an e-mail login flow, by generating a token,
 * and sending it to the user's e-mail (with the help of a DB adapter)
 * @param {string} identifier
 * @param {import("types/internals").AppOptions} options
 */
export default async function email(identifier, options) {
  const { baseUrl, basePath, adapter, logger } = options
  /** @type {import("types/providers").EmailConfig} */
  const provider = options.provider

  // Generate token
  const { generateVerificationToken } = provider
  const token =
    (await generateVerificationToken?.()) ?? randomBytes(32).toString("hex")

  // Generate the hashed token that will be stored in the DB
  const hashedToken = hashToken(token, options)

  // Generate a link with email and the unhashed token
  const params = new URLSearchParams({ token, email: identifier })
  const url = `${baseUrl}${basePath}/callback/${provider.id}?${params}`

  const { createVerificationRequest } = adapterErrorHandler(
    await adapter.getAdapter(options),
    logger
  )
  // TODO: simplify arguments in a future major release to something like:
  // { identifier, url, hashedToken, provider }
  await createVerificationRequest(
    identifier,
    url,
    token,
    // TODO: Drop this, as we can send a already hashed token instead.
    // Prefer provider specific secret, but use default secret if none specified
    provider.secret ?? options.secret,
    {
      ...provider,
      // We send this method to the adapter for compatibility reasons,
      // but we call it ourselves below.
      sendVerificationRequest() {
        return Promise.resolve()
      },
    },
    options,
    hashedToken
  )

  await provider.sendVerificationRequest({
    identifier,
    url,
    token,
    baseUrl,
    provider,
  })
}

/**
 * @todo Use bcrypt or a more secure method
 * @param {string} token
 * @param {import("types/internals").AppOptions} options
 */
export function hashToken(token, options) {
  // Prefer provider specific secret, but use default secret if none specified
  const secret = options.provider.secret ?? options.secret
  return createHash("sha256").update(`${token}${secret}`).digest("hex")
}
