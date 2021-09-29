/** @type {import(".").OAuthProvider} */
export default function AzureAD(options) {
  const tenant = options.tenantId ?? "common"

  return {
    id: "azure-ad",
    name: "Azure Active Directory",
    type: "oauth",
    wellKnown: `https://login.microsoftonline.com/${tenant}/v2.0/.well-known/openid-configuration`,
    authorization: {
      params: {
        scope: "User.Read",
      },
    },
    async profile(profile, tokens) {
      // https://docs.microsoft.com/en-us/graph/api/profilephoto-get?view=graph-rest-1.0#examples
      const profilePicture = await fetch(
        "https://graph.microsoft.com/v1.0/me/photo/$value",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        }
      )
      const pictureBuffer = await profilePicture.arrayBuffer()
      const pictureBase64 = Buffer.from(pictureBuffer).toString("base64")
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: `data:image/jpeg;base64, ${pictureBase64}`,
      }
    },
    options,
  }
}
