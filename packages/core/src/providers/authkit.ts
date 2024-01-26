export default function AuthKit(
  options
) {
  const { issuer = "https://api.workos.com/" } = options

  return {
    id: "authkit",
    name: "AuthKit",
    type: "oauth",
    authorization: `${issuer}user_management/authorize`,
    token: `${issuer}authenticate`,
    client: {
      token_endpoint_auth_method: "client_secret_post",
    },
    userinfo: `${issuer}sso/profile`,
    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        image: profile.raw_attributes.picture ?? null,
      }
    },
    style: { logo: "/workos.svg", bg: "#6363f1", text: "#fff" },
    options,
  }
}
