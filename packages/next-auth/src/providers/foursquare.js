import { get } from "https"
import { once } from "events"

/** @type {import("src/providers").OAuthProvider} */
/** @type {import(".").OAuthProvider} */
export default function Foursquare(options) {
  const { apiVersion = "20210801" } = options
  return {
    id: "foursquare",
    name: "Foursquare",
    type: "oauth",
    authorization: "https://foursquare.com/oauth2/authenticate",
    token: "https://foursquare.com/oauth2/access_token",
    userinfo: {
      async request({ tokens }) {
        const url = new URL("https://api.foursquare.com/v2/users/self")
        url.searchParams.append("v", apiVersion)
        url.searchParams.append("oauth_token", tokens.access_token)

        const req = get(url, { timeout: 3500 })
        const [response] = await Promise.race([
          once(req, "response"),
          once(req, "timeout"),
        ])

        // timeout reached
        if (!response) {
          req.destroy()
          throw new Error("HTTP Request Timed Out")
        }
        if (response.statusCode !== 200) {
          throw new Error("Expected 200 OK from the userinfo endpoint")
        }

        const parts = []
        for await (const part of response) {
          parts.push(part)
        }

        return JSON.parse(Buffer.concat(parts))
      },
    },
    profile({ response: { profile } }) {
      return {
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        email: profile.contact.email,
        image: profile.photo
          ? `${profile.photo.prefix}original${profile.photo.suffix}`
          : null,
      }
    },
    style: {
      logo: "/foursquare.svg",
      logoDark: "/foursquare-dark.svg",
      bg: "#fff",
      text: "#000",
      bgDark: "#000",
      textDark: "#fff",
    },
    options,
  }
}
