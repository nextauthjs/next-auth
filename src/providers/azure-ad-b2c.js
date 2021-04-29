export default function AzureADB2C(options) {
  const { tenantName, primaryUserFlow } = options
  const authorizeUrl = `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${primaryUserFlow}/oauth2/v2.0/authorize`
  const tokenUrl = `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${primaryUserFlow}/oauth2/v2.0/token`

  return {
    id: "azure-ad-b2c",
    name: "Azure Active Directory B2C",
    type: "oauth",
    version: "2.0",
    params: {
      grant_type: "authorization_code",
    },
    accessTokenUrl: tokenUrl,
    requestTokenUrl: tokenUrl,
    authorizationUrl: `${authorizeUrl}?response_type=code+id_token&response_mode=query`,
    profileUrl: 'https://graph.microsoft.com/oidc/userinfo',
    idToken: true,
    profile: (profile) => {
      let name = ''

      if (profile.name) {
        // B2C "Display Name"
        name = profile.name
      } else if (profile.given_name && profile.family_name) {
        // B2C "Given Name" & "Surname"
        name = `${profile.given_name} ${profile.family_name}`
      } else if (profile.given_name) {
        // B2C "Given Name"
        name = `${profile.given_name}`
      }

      return {
        name,
        id: profile.oid,
        email: profile.emails[0]
      }
    },
    ...options,
  }
}
