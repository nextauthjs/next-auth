/** @type {import(".").OAuthProvider} */
export default function Twitter(options) {
  return {
    id: "twitter",
    name: "Twitter",
    type: "oauth",
    version: "1.0A",
    authorization: "https://api.twitter.com/oauth/authenticate",
    accessTokenUrl: "https://api.twitter.com/oauth/access_token",
    requestTokenUrl: "https://api.twitter.com/oauth/request_token",
    profileUrl:
      "https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true",
    profile(profile) {
      return {
        id: profile.id_str,
        name: profile.name,
        email: profile.email,
        image: profile.profile_image_url_https.replace(
          /_normal\.(jpg|png|gif)$/,
          ".$1"
        ),
      }
    },
    options,
  }
}
