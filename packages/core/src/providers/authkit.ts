import type { OAuthConfig } from "./index.js"

export default function AuthKit(options): OAuthConfig<Record<string, any>> {
  const { issuer = "https://api.workos.com/" } = options

  return {
    id: "authkit",
    name: "AuthKit",
    type: "oauth",
    authorization: {
      url: `${issuer}user_management/authorize`,
      params: {
        client_id: options.clientId,
        redirect_uri: options.redirectUri,
        response_type: "code",
      },
    },
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    style: { logo: "/authkit.svg", bg: "#12192A", text: "#fff" },
    options,
  }
}
