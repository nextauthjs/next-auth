import type { OAuthConfig, OAuthUserConfig } from ".";

export interface MastodonProfile extends Record<string, any> {
  id: string,
  username: string,
  acct: string,
  display_name: string,
  locked: boolean,
  bot: boolean,
  created_at: string,
  note: string,
  url: string,
  avatar: string;
  avatar_static: string;
  header: string;
  header_static: string;
  followers_count: number;
  following_count: number;
  statuses_count: number;
  last_status_at: string | null;
}

export default function Mastodon<P extends MastodonProfile>(
  options: OAuthUserConfig<P> & {
    issuer: string
  }
): OAuthConfig<P> {
  return {
    id: "mastodon",
    name: "Mastodon",
    type: "oauth",
    authorization: `${options.issuer}/oauth/authorize?scope=read`,
    token: `${options.issuer}/oauth/token`,
    userinfo: `${options.issuer}/api/v1/accounts/verify_credentials`,
    profile(profile) {
      return {
        id: profile.id,
        name: profile.username,
        image: profile.avatar_static,
        email: null,
      }
    },
    options
  }
}