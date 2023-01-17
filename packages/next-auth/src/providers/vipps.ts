import type { OAuthConfig, OAuthUserConfig } from "./index.js"

export interface VippsProfile {
  id: string;
  birthdate: string;
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  phone_number: string;
  sid: string;
  sub: string;
}

export default function Vipps<P extends VippsProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "vipps",
    name: "Vipps",
    type: "oauth",
    wellKnown: `${options.issuer}/access-management-1.0/access/.well-known/openid-configuration`,
    authorization: {
      params: { scope: "openid email name" },
    },
    userinfo: {
      url: `${options.issuer}/vipps-userinfo-api/userinfo`,
      async request({ client, tokens }) {
        const profile = await client.userinfo(tokens.access_token);
        return profile;
      },
    },
    idToken: true,
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: null,
      };
    },
    style: {
      logo: "/vipps.svg",
      logoDark:
        "/vipps-dark.svg",
      bgDark: "#f05c18",
      bg: "#f05c18",
      text: "#fff",
      textDark: "#fff",
    },
    options,
  };
}
