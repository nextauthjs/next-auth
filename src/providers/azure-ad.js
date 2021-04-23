export default function AzureAD(options) {
  const originUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

  return {
    id: 'azure-ad',
    name: 'Azure Active Directory',
    type: 'oauth',
    version: '2.0',
    scope: 'openid email profile',
    params: {
      grant_type: 'authorization_code',
    },
    headers: {
      Origin: originUrl,
    },
    protection: 'pkce',
    accessTokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize?response_type=code&response_mode=query',
    profileUrl: 'https://graph.microsoft.com/oidc/userinfo',
    profile: profile => {
      return {
        id: profile.oid,
        name: profile.name,
        email: profile.email,
      }
    },
    clientId: process.env.AZURE_CLIENT_ID,
    idToken: true,
    state: false,
    ...options,
  }
}
