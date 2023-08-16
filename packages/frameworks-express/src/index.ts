import { Auth } from "@auth/core"
import type { AuthConfig, Session } from "@auth/core/types"
import { Request as ExpressRequest, Response as ExpressResponse } from "express"
import { toWebRequest, toExpressResponse } from "./http-api-adapters.js"

function ExpressAuthHandler(authConfig: AuthConfig) {
  return async (req: ExpressRequest, res: ExpressResponse) => {
    const request = toWebRequest(req)
    const response = await Auth(request, authConfig)
    await toExpressResponse(response, res)
  }
}

export function ExpressAuth(
  config: AuthConfig
): ReturnType<typeof ExpressAuthHandler> {
  const { ...authOptions } = config
  authOptions.secret ??= process.env.AUTH_SECRET
  authOptions.trustHost ??= !!(
    process.env.AUTH_TRUST_HOST ??
    process.env.VERCEL ??
    process.env.NODE_ENV !== "production"
  )

  const handler = ExpressAuthHandler(authOptions)

  return handler
}

export type GetSessionResult = Promise<Session | null>

export async function getSession(
  req: ExpressRequest,
  options: AuthConfig
): GetSessionResult {
  options.secret ??= process.env.AUTH_SECRET
  options.trustHost ??= true

  const request = toWebRequest(req)
  const url = new URL("/api/auth/session", request.url)

  const response = await Auth(
    new Request(url, { headers: request.headers }),
    options
  )

  const { status = 200 } = response

  const data = await response.json()

  if (!data || !Object.keys(data).length) return null
  if (status === 200) return data
  throw new Error(data.message)
}