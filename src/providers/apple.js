export default function Apple(options) {
  return {
    id: "apple",
    name: "Apple",
    type: "oauth",
    authorization: {
      url: "https://appleid.apple.com/auth/authorize",
      params: {
        scope: "name email",
        response_type: "code",
        id_token: "",
        response_mode: "form_post",
      },
    },
    token: {
      url: "https://appleid.apple.com/auth/token",
      idToken: true,
    },
    jwks_endpoint: "https://appleid.apple.com/auth/keys",
    profile(profile) {
      // The name of the user will only be returned on first login
      const name = profile.user
        ? profile.user.name.firstName + " " + profile.user.name.lastName
        : null

      return {
        id: profile.sub,
        name,
        email: profile.email,
        image: null,
      }
    },
    checks: ["none"], // REVIEW: Apple does not support state, as far as I know. Can we use "pkce" then?
    options,
  }
}
