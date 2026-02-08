/**
 * @module providers/authkit
 */
import { JsonObject } from "oauth4webapi"
import type { OAuthConfig, OAuthUserConfig } from "./index.js"
/**
 * - {@link https://api.workos.com/user_management/users/<user_id> | The returned profile object}
 */
export interface AuthKitProfile extends Record<string, any> {
  object: string
  id: string
  email: string
  email_verified: boolean
  first_name?: string | null
  last_name?: string | null
  profile_picture_url?: string | null
  created_at: string
  updated_at: string
}

export default function AuthKit<P extends AuthKitProfile>(
  options: OAuthUserConfig<P> & {
    authkitProvider?:
      | "authkit"
      | "GoogleOAuth"
      | "AppleOAuth"
      | "MicrosoftOAuth"
      | "GitHubOAuth"
    screenHint?: "sign-in" | "sign-up"
  }
): OAuthConfig<P> {
  return {
    id: "authkit",
    name: "AuthKit",
    type: "oauth",
    authorization: {
      url: "https://api.workos.com/user_management/authorize",
      params: {
        provider: options.authkitProvider ?? "authkit",
        screen_hint: options.screenHint ?? "sign-up",
      },
    },
    token: {
      url: "https://api.workos.com/user_management/authenticate",
      async conform(res: Response) {
        const data = await res.json()
        if (data.token_type === "bearer") {
          console.warn(
            "token_type is 'bearer'. Redundant workaround, please open an issue."
          )
          return res
        }
        return Response.json({ ...data, token_type: "bearer" }, res)
      },
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    userinfo: {
      url: "https://api.workos.com/user_management/users",
      async request({ tokens, provider }) {
        const response = await fetch(
          `${provider.userinfo?.url}/${(tokens.user as JsonObject)?.id}`,
          {
            headers: {
              Authorization: `Bearer ${provider.clientSecret}`,
            },
          }
        )
        return response.json()
      },
    },
    profile(profile) {
      let name = null
      if (profile.first_name) {
        name = profile.first_name
      }
      if (profile.last_name) {
        name = name ? `${name} ${profile.last_name}` : profile.last_name
      }
      return {
        id: profile.id,
        name,
        email: profile.email,
        image: profile.profile_picture_url ?? null,
      }
    },
    style: { bg: "#6363f1", text: "#fff" },
    options,
  }
}
