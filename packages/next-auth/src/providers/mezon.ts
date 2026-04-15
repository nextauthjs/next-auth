import type { OAuthConfig, OAuthUserConfig } from "."

export interface MezonProfile extends Record<string, any> {
  user_id: string;
  email: string;
  display_name?: string;
  avatar?: string;
  mezon_id: string;
  sub: string;
  username: string;
}

export default function Mezon<P extends MezonProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "mezon",
    name: "Mezon",
    type: "oauth",
    wellKnown: "https://oauth2.mezon.ai/.well-known/openid-configuration",
    authorization: {
      url: "https://oauth2.mezon.ai/oauth2/auth",
      params: {
        scope: "offline openid",
      },
    },
    token: "https://oauth2.mezon.ai/oauth2/token",
    userinfo: "https://oauth2.mezon.ai/userinfo",
    profile(profile) {
      return {
        id: profile.user_id,
        name: profile?.display_name ?? profile?.username,
        email: profile.email,
        image: profile?.avatar,
      }
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    options
  };
}
