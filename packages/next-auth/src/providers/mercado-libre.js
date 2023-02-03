/** @type {import(".").OAuthProvider} */
export default function MercadoLibreProvider(options) {
  const { clientId, redirectUri, clientSecret } = options;

  return {
    id: "mercado-libre",
    name: "Mercado Libre",
    type: "oauth",
    version: "2.0",
    responseType: "code",
    authorization: {
      url: "https://auth.mercadolibre.cl/authorization?response_type=code",
      params: { grant_type: "authorization_code" },
    },
    token: {
      url: "https://api.mercadolibre.com/oauth/token",
      async request({ params, provider }) {
        const response = await fetch(provider.token.url, {
          method: "POST",
          body: JSON.stringify({
            grant_type: "authorization_code",
            code: params.code,
            client_id: clientId,
            client_secret: clientSecret,
            redirect_uri: redirectUri,
          }),
        });

        return { tokens: await response.json() };
      },
    },
    userinfo: {
      url: "https://api.mercadolibre.com/users/me",
      request({ client, tokens }) {
        return client.userinfo(tokens.access_token);
      },
    },
    profile(profile) {
      return {
        id: profile.id,
        name: profile.nickname,
        email: profile.email,
        image: profile.thumbnail.picture_url,
      };
    },
    options,
  };
}
