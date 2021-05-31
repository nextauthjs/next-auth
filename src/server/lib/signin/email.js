import { randomBytes } from "crypto"
import adapterErrorHandler from "../../../adapters/error-handler"

/**
 * Starts an e-mail login flow, by generating a token,
 * and sending it to the user's e-mail (with the help of a DB adapter)
 * @param {string} identifier
 * @param {import("types/providers").EmailConfig} provider
 * @param {import("types/internals").AppOptions} options
 */
export default async function email(identifier, provider, options) {

    const { createVerificationRequest } = adapterErrorHandler(
      await adapter.getAdapter(options),
      logger
    )

    // Prefer provider specific secret, but use default secret if none specified
    const secret = provider.secret || options.secret

    // Generate token
  const { generateVerificationToken } = provider
  const token =
    (await generateVerificationToken?.(identifier)) ??
    randomBytes(32).toString("hex")

    // Send email with link containing token (the unhashed version)
    const url = `${baseUrl}${basePath}/callback/${encodeURIComponent(
      provider.id
    )}?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`

    // @TODO Create invite (send secret so can be hashed)
    await createVerificationRequest(
      email,
      url,
      token,
      secret,
      provider,
      options
    )

    // Return promise
    return Promise.resolve()
  } catch (error) {
    return Promise.reject(error)
  }
}
