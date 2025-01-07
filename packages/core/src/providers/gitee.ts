/**
 * <div class="provider" style={{backgroundColor: "#24292f", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Gitee</b> integration.</span>
 * <a href="https://gitee.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/gitee.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/gitee
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"
import type { TokenSet } from "../types.js"
export interface GiteeProfile {
  id: number;
  name?: string;
  login: string;
  email?: string;
  avatar_url?: string;
}

export default function Gitee(
  config: OAuthUserConfig<GiteeProfile>
): OAuthConfig<GiteeProfile> {
  const baseUrl = "https://gitee.com";
  const apiBaseUrl = "https://gitee.com/api/v5";

  return {
    id: "gitee",
    name: "Gitee",
    type: "oauth",
    authorization: {
      url: `${baseUrl}/oauth/authorize`,
      params: {
        scope: "",
      },
    },
    token: {
      url: `${baseUrl}/oauth/token`,
      params: {
        grant_type: "authorization_code",
      },
    },
    userinfo: {
      url: `${apiBaseUrl}/user`,
      request: async function ({
        tokens,
        provider,
      }: {
        tokens: TokenSet;
        provider: {
          token?: {
            url: URL;
          };
          userinfo?: {
            url?: URL;
          };
        };
      }) {
        const profile = await fetch(provider.userinfo?.url as URL, {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "User-Agent": "authjs",
          },
        }).then(async (res) => await res.json());

        if (!profile.email) {
          const res = await fetch(`${apiBaseUrl}/user/emails`, {
            headers: {
              Authorization: `Bearer ${tokens.access_token}`,
              "User-Agent": "authjs",
            },
          });

          if (res.ok) {
            const emails: { primary: boolean; email: string }[] =
              await res.json();
            profile.email = (emails.find((e) => e.primary) ?? emails[0])?.email;
          }
        }

        return profile;
      },
    },
    profile(profile) {
      return {
        id: profile.id.toString(),
        name: profile.name ?? profile.login,
        email: profile.email,
        image: profile.avatar_url,
      };
    },
    options: config,
  };
}
