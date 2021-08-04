export default function AzureAD(options) {
  const tenant = options.tenantId ?? "common"

  return {
    id: "azure-ad",
    name: "Azure Active Directory",
    type: "oauth",
    authorization: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?response_mode=query`,
    token: `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`,
    userinfo: "https://graph.microsoft.com/v1.0/me/",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.displayName,
        email: profile.userPrincipalName,
        image: null,
      }
    },
    options,
  }
}
