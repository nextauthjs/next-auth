import { getAuthorizationUrl } from "./authorization-url.js"
import { sendToken } from "./send-token.js"

import type {
  InternalConfig,
  RequestInternal,
  ResponseInternal,
} from "../../../types.js"

export async function signIn(
  request: RequestInternal,
  config: InternalConfig
): Promise<ResponseInternal> {
  const { resCookies: cookies } = config
  const signInUrl = `${config.url.origin}${config.basePath}/signin`

  if (!config.provider) return { redirect: signInUrl, cookies }

  switch (config.provider.type) {
    case "oauth":
    case "oidc": {
      const { redirect, cookies: authCookies } = await getAuthorizationUrl(
        request.query,
        config
      )
      if (authCookies) cookies.push(...authCookies)
      return { redirect, cookies }
    }
    case "email": {
      const response = await sendToken(request, config)
      return { ...response, cookies }
    }
    default:
      return { redirect: signInUrl, cookies }
  }
}
