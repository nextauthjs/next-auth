export default function BeyondIdentity(options) {
    return {
      id: "beyondidentity",
      name: "Beyond Identity",
      type: "oauth",
      version: "2.0",
      scope: "openid",
      params: { grant_type: "authorization_code" },
      authorizationUrl: "https://authenticator.beyondidentity.com/authorize?response_type=code",
      accessTokenUrl: "https://auth.byndid.com/v2/token",
      profileUrl: "https://auth.byndid.com/v2/userinfo",
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.sub,
        }
      },
      ...options,
    }
  }
  