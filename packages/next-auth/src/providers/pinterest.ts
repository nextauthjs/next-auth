import { OAuthConfig, OAuthUserConfig } from ".";

export interface PinterestProfile extends Record<string, any> {
  account_type: "BUSINESS" | "PINNER";
  profile_image: string;
  website_url: string;
  username: string;
}

const PinterestProvider = <P extends PinterestProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> => {
  return {
    id: "pinterest",
    name: "Pinterest",
    type: "oauth",
    authorization: {
      url: "https://www.pinterest.com/oauth",
      params: {
        scope: "user_accounts:read",
      },
    },
    checks: ["state"],
    token: {
      url: "https://api.pinterest.com/v5/oauth/token",
    },
    userinfo: {
      url: "https://api.pinterest.com/v5/user_account",
    },
    profile({ username, profile_image, ...profile }) {
      return { id: username, name: username, image: profile_image, ...profile  };
    },
    options
  };
};

export default PinterestProvider;
