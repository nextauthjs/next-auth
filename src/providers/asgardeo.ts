import type { OAuthConfig, OAuthUserConfig } from "."

export default function Asgardeo<P extends {}>(
  options: OAuthUserConfig<P> & {
    organizationName: string
    scopes?: string
  }
): OAuthConfig<P> {
  return {
    id: "asgardeo",
    name: "Asgardeo",
    clientId: options?.clientId,
    clientSecret: options?.clientSecret,
    type: "oauth",
    wellKnown: `https://api.asgardeo.io/t/${options?.organizationName}/oauth2/token/.well-known/openid-configuration`,
    authorization: {
      params: { scope: options?.scopes || "openid email profile" } 
    },
    idToken: true,
    checks: ["pkce", "state"],
    async profile(profile, tokens) {
      const config = {
          method: 'GET',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'authorization': `Bearer ${tokens.access_token}`
          },
      }

      const response = await fetch(`https://api.asgardeo.io/t/${options?.organizationName}/oauth2/userinfo`, config);

      const userResponse = await response.json();
      
      return {
          id: userResponse?.sub,
          name: userResponse?.given_name.trim(),
          email: userResponse?.email,
          image: userResponse?.profile
      }
    },
    options,
  }
}
