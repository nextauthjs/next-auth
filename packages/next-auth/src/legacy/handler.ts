import { Auth, AuthConfig, setEnvDefaults } from "@auth/core"
import { reqWithEnvURL, setCookie } from "./utils.js"
import { NextApiRequest, NextApiResponse } from "next"

// Re-export AuthConfig as NextAuthOptions for backward compatibility
export type NextAuthOptions = AuthConfig

// @see https://beta.nextjs.org/docs/routing/route-handlers

async function NextAuthApiHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  options: NextAuthOptions
) {
  setEnvDefaults(process.env, options)
  // Create a Request object from the NextApiRequest
  const request = reqWithEnvURL(req)

  console.log({ request, req })

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
