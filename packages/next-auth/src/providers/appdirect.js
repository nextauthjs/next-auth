/** @type {import(".").OAuthProvider} */
export default function AppDirect(options) {
    const marketplaceUrl =
        options.marketplaceUrl ??
        `https://marketplace.appdirect.com`
    return {
        id: "appdirect",
        name: "AppDirect",
        type: "oauth",
        wellKnown: `https://${marketplaceUrl}/.well-known/openid-configuration`,
        authorization: {
          params: {
            scope: "openid email profile company",
          },
        },
        checks: ["state"],
        profile(profile) {
          return {
            id: profile.sub,
            name: `${profile.given_name} ${profile.family_name}`,
            email: profile.email,
            picture: null
          };
        },
      };
}
  