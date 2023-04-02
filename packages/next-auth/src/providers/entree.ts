import type { OAuthConfig, OAuthUserConfig } from "."

export interface EntreeProfile extends Record<string, any> {
  id: string
  email: string
}

export default function Entree<P extends EntreeProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    wellKnown: "https://oidcng.entree-s.kennisnet.nl/.well-known/openid-configuration",
    id: "entree",
    name: "Kennisnet Entree",
    type: "oauth",
   authorization: { params: { scope: "openid email" } },
    idToken: true,
     profile(profile) {
        return {
          id: profile.sub,
          email: profile.sub,
        };
      },
    style: {
      logo: "https://developers.wiki.kennisnet.nl/images/f/f6/Entree_logo_400x400.png",
      logoDark:
        "https://developers.wiki.kennisnet.nl/images/f/f6/Entree_logo_400x400.png",
      bg: "#2E3093",
      text: "#fff",
      bgDark: "#2E3093",
      textDark: "#fff",
    },
    options,
  }
}
