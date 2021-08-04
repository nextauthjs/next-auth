export default function AzureADB2C(options) {
  const { tenantName, primaryUserFlow } = options

  return {
    id: "azure-ad-b2c",
    name: "Azure Active Directory B2C",
    type: "oauth",
    authorization: {
      url: `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${primaryUserFlow}/oauth2/v2.0/authorize`,
      params: {
        response_type: "code id_token",
        response_mode: "query",
      },
    },
    token: {
      url: `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${primaryUserFlow}/oauth2/v2.0/token`,
      idToken: true,
    },
    jwks_uri: `https://${tenantName}.b2clogin.com/${tenantName}.onmicrosoft.com/${primaryUserFlow}}/discovery/v2.0/keys`,
    profile(profile) {
      let name = ""

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
        id: profile.oid,
        name,
        email: profile.emails[0],
        image: null,
      }
    },
    options,
  }
}
