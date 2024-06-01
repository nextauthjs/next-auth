/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Amazon</b> integration.
 * </span>
 * <a href="https://www.amazon.com" style={{backgroundColor: "black", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/amazon.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/amazon
 */

import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/** The returned user profile from Amazon when using the profile callback. */
export interface AmazonProfile extends Record<string, any> {
  Profile?: {
    CustomerId: string;
    Name: string;
    PrimaryEmail: string;
  };
  user_id: string;
  name: string;
  email: string;
}

/**
 * Add Amazon login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/amazon
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Amazon from "next-auth/providers/amazon"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Amazon({ clientId: AMAZON_CLIENT_ID, clientSecret: AMAZON_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Login with Amazon (LWA) documentation](https://developer.amazon.com/docs/login-with-amazon/documentation-overview.html)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Amazon provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Amazon provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/amazon.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 *
 * :::
 *
 * :::info **Disclaimer**
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 *
 * :::
 */
export default function Amazon<P extends AmazonProfile>(
  options: OAuthUserConfig<P> & { scope?: string }
): OAuthConfig<P> {
  const scope = options.scope ?? "profile profile:user_id"
  const tokenEndpointUrl = "https://api.amazon.com/auth/o2/token"
  const userInfoEndpointUrl = "https://api.amazon.com/user/profile"

  return {
    id: "amazon",
    name: "Amazon",
    type: "oauth",
    authorization: {
      url: "https://www.amazon.com/ap/oa",
      params: { scope },
    },
    token: {
      url: tokenEndpointUrl,
      async request({ provider, params }) {
        const url = new URL(tokenEndpointUrl);
        url.searchParams.set("grant_type", "authorization_code");
        url.searchParams.set("code", params.code as string);
        url.searchParams.set("client_id", provider.clientId as string);
        url.searchParams.set("client_secret", provider.clientSecret as string);
        url.searchParams.set("redirect_uri", provider.callbackUrl);

        const response = await fetch(url, { method: "POST" });
        const data = await response.json();

        return {
          tokens: {
            access_token: data.access_token,
            refresh_token: data.refresh_token,
            token_type: data.token_type,
            expires_at: Math.ceil(Date.now() / 1000 + +Number(data.expires_in)),
          },
        };
      },
    },
    userinfo: {
      url: userInfoEndpointUrl,
      async request(context) {
        const accessToken = context.tokens.access_token as string
        const response = await fetch(userInfoEndpointUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        return response.json()
      },
    },
    profile(profile: P) {
      if (profile.Profile)
        return {
          id: profile.Profile.CustomerId,
          name: profile.Profile.Name,
          email: profile.Profile.PrimaryEmail,
          image: "",
        };
      return {
        id: profile.user_id,
        name: profile.name,
        email: profile.email,
        image: "",
      };
    },
    style: {
      brandColor: "#ff9900",
    },
    options,
  };
}
