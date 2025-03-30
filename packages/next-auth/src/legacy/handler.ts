import { Auth, AuthConfig, setEnvDefaults } from "@auth/core"
import { reqWithEnvURL, setCookie } from "./utils.js"
import { NextApiRequest, NextApiResponse } from "next"
import { jwtDecrypt } from "jose"
import { hkdf } from "@panva/hkdf"

// Re-export AuthConfig as NextAuthOptions for backward compatibility
export type NextAuthOptions = AuthConfig

/**
 * Helper function to derive encryption key for JWT decoding compatibility
 * between v4 and v5 tokens
 */
async function getDerivedEncryptionKey(ikm: string | Buffer, _salt: string) {
  const salt = _salt.includes(".session-token") ? "" : _salt
  const prefix = "NextAuth.js Generated Encryption Key"
  const info = `${prefix}${salt ? ` (${salt})` : ""}`
  // @ts-expect-error -- TypeScript doesn't recognize the Buffer type
  return await hkdf("sha256", ikm, salt, info, 32)
}

async function NextAuthApiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
) {
  setEnvDefaults(process.env, options)

  // Set up v4 compatibility for JWT decoding
  if (!options.jwt) options.jwt = {}
  const originalDecode = options.jwt.decode

  options.jwt.decode = async (params) => {
    if (!params.token) return null

    // First try the original decode method if provided
    if (originalDecode) {
      try {
        return await originalDecode(params)
      } catch (error) {
        // Fall through to compatibility methods if original decode fails
        console.error("Failed to decode JWT using original method", error)
      }
    }

    // Try standard v5 decoding
    try {
      // Import dynamically to avoid circular dependencies
      const { decode } = await import("../jwt.js")
      return await decode(params)
    } catch (error) {
      // Fall back to v4 compatibility mode
      console.error("Failed to decode JWT using v5 method", error)
      try {
        const { token: jwt, secret, salt } = params
        const key = await getDerivedEncryptionKey(
          [secret].flat()[0],
          salt || ""
        )
        const { payload } = await jwtDecrypt(jwt, key, { clockTolerance: 15 })
        return payload
      } catch (finalError) {
        console.error("Failed to decode JWT", finalError)
        return null
      }
    }
  }

  // Create a Request object from the NextApiRequest
  const request = reqWithEnvURL(req)

  // Auth expects a Request object
  const response = await Auth(request, options)

  // Handle the response
  // Set status code
  res.status(response.status)

  // Set headers
  response.headers.forEach((cookie) => {
    setCookie(res, cookie)
  })

  // Handle redirects
  if (response.headers.has("Location")) {
    res.redirect(response.status, response.headers.get("Location") as string)
    return
  }

  // Handle response body
  if (response.body) {
    const contentType = response.headers.get("content-type")

    // Determine how to send the body based on content type
    if (contentType?.includes("application/json")) {
      const body = await response.json()
      return res.json(body)
    } else {
      const body = await response.text()
      return res.send(body)
    }
  } else {
    return res.end()
  }
}

/** The main entry point to next-auth */
function NextAuth(
  ...args: [NextAuthOptions] | Parameters<typeof NextAuthApiHandler>
) {
  console.log({ args })
  if (args.length === 1) {
    return async (req: NextApiRequest, res: NextApiResponse) => {
      if ("params" in req) {
        throw new ReferenceError(
          "Legacy handler is only available in the Pages Router."
        )
      }

      return await NextAuthApiHandler(req, res, args[0])
    }
  }

  throw new ReferenceError(
    "Legacy handler is only available in the Pages Router."
  )
}

/**
 * :::warning Deprecated
 * This module is replaced in v5. Read more at: https://authjs.dev/getting-started/migrating-to-v5#authenticating-server-side
 * :::
 *
 * NextAuth.js handler for the Pages Router
 */
export default NextAuth
