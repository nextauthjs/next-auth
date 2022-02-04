import type { OAuthConfig, OAuthUserConfig } from "."

export interface VkProfile {
  response: Array<{
    id: number
    first_name: string
    last_name: string
    photo_100: string
    can_access_closed: boolean
    is_closed: boolean
  }>
}

export default function VK<
  P extends Record<string, any> = VkProfile
>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  const apiVersion = "5.131" // https://vk.com/dev/versions

  return {
    id: "vk",
    name: "VK",
    type: "oauth",
    authorization: `https://oauth.vk.com/authorize?scope=email&v=${apiVersion}`,
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    token: `https://oauth.vk.com/access_token?v=${apiVersion}`,
    userinfo: `https://api.vk.com/method/users.get?fields=photo_100&v=${apiVersion}`,
    profile(result: P) {
      const profile = result.response?.[0] ?? {}
      return {
        id: profile.id,
        name: [profile.first_name, profile.last_name].filter(Boolean).join(" "),
        email: null,
        image: profile.photo_100,
      }
    },
    options,
  }
}
