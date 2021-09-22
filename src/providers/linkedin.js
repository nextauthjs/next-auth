/** @type {import(".").OAuthProvider} */
export default function LinkedIn(options) {
  return {
    id: "linkedin",
    name: "LinkedIn",
    type: "oauth",
    authorization: {
      url: "https://www.linkedin.com/oauth/v2/authorization",
      params: { scope: "r_liteprofile r_emailaddress" },
    },
    token: "https://www.linkedin.com/oauth/v2/accessToken",
    userinfo: {
      url: "https://api.linkedin.com/v2/me",
      params: {
        projection: `(id,localizedFirstName,localizedLastName,profilePicture(displayImage~digitalmediaAsset:playableStreams))`,
      },
    },
    async profile(profile, tokens) {
      const emailResponse = await fetch(
        "https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))",
        { headers: { Authorization: `Bearer ${tokens.access_token}` } }
      )
      const emailData = await emailResponse.json()
      return {
        id: profile.id,
        name: `${profile.localizedFirstName} ${profile.localizedLastName}`,
        email: emailData?.elements?.[0]?.["handle~"]?.emailAddress,
        image:
          profile.profilePicture?.["displayImage~"]?.elements?.[0]
            ?.identifiers?.[0]?.identifier,
      }
    },
    options,
  }
}
