/** @type {import(".").OAuthProvider} */
export default function FACEIT(options) {
  return {
    id: "faceit",
    name: "FACEIT",
    type: "oauth",
    authorization: "https://accounts.faceit.com/accounts?redirect_popup=true",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${options.clientId}:${options.clientSecret}`
      ).toString("base64")}`,
    },
    token: {
      url: "https://api.faceit.com/auth/v1/oauth/token",
      request: async params => {
        const { token } = params.provider;
        const { code } = params.params;
        const endpointUrl = typeof token === 'string' ? token : token?.url;
        if (!endpointUrl) {
          throw new Error('Token url not provided');
        }
        const url = new URL(endpointUrl);
        const queryParams = new URLSearchParams({ code, grant_type: 'authorization_code' });
        url.search = `?${queryParams}`;
        const apiResponse = await fetch(url.toString(), { method: 'POST', headers: params.provider.headers })
          .then(res => res.json());

        return {
          tokens: {
            access_token: apiResponse.access_token,
          }
        }
      }
    },
    userinfo: "https://api.faceit.com/auth/v1/resources/userinfo",
    profile(profile) {
      return {
        id: profile.guid,
        name: profile.nickname,
        email: profile.email,
        image: profile.picture,
      }
    },
    options,
  }
}
