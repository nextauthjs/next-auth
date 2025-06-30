/**
 * <div class="provider" style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>FusionAuth</b> integration.</span>
 * <a href="https://fusionauth.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/fushionauth.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/fusionauth
 */
import type { OAuthConfig, OAuthUserConfig } from "./oauth.js"

/**
 * This is the default openid signature returned from FusionAuth
 * it can be customized using [lambda functions](https://fusionauth.io/docs/v1/tech/lambdas)
 */
export interface FusionAuthProfile extends Record<string, any> {
  aud: string
  exp: number
  iat: number
  iss: string
  sub: string
  jti: string
  authenticationType: string
  email: string
  email_verified: boolean
  preferred_username?: string
  name?: string
  given_name?: string
  middle_name?: string
  family_name?: string
  at_hash: string
  c_hash: string
  scope: string
  sid: string
  picture?: string
}

/**
 * Add FusionAuth login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/fusionauth
 * ```
 *
 * #### Configuration
 *```ts
 * import { Auth } from "@auth/core"
 * import FusionAuth from "@auth/core/providers/fusionauth"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [
 *     FusionAuth({
 *       clientId: FUSIONAUTH_CLIENT_ID,
 *       clientSecret: FUSIONAUTH_CLIENT_SECRET,
 *       tenantId: FUSIONAUTH_TENANT_ID,
 *       issuer: FUSIONAUTH_ISSUER,
 *     }),
 *   ],
 * })
 * ```
 * :::warning
 * If you're using multi-tenancy, you need to pass in the tenantId option to apply the proper theme.
 * :::
 *
 * ### Resources
 *
 *  - [FusionAuth OAuth documentation](https://fusionauth.io/docs/lifecycle/authenticate-users/oauth/)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the FusionAuth provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * ## Configuration
 * :::tip
 * An application can be created at https://your-fusionauth-server-url/admin/application.
 *
 * For more information, follow the [FusionAuth 5-minute setup guide](https://fusionauth.io/docs/v1/tech/5-minute-setup-guide).
 * :::
 *
 * In the OAuth settings for your application, configure the following.
 *
 * - Redirect URL
 *   - https://localhost:3000/api/auth/callback/fusionauth
 * - Enabled grants
 *   - Make sure _Authorization Code_ is enabled.
 *
 * If using JSON Web Tokens, you need to make sure the signing algorithm is RS256, you can create an RS256 key pair by
 * going to Settings, Key Master, generate RSA and choosing SHA-256 as algorithm. After that, go to the JWT settings of
 * your application and select this key as Access Token signing key and Id Token signing key.
 * :::tip
 *
 * The FusionAuth provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/fusionauth.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
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
 * 
 * 
 * It is highly recommended to follow this example call when using the provider in Next.js
 *  so that you can access both the access_token and id_token on the server.
 * 
 * /// <reference types="next-auth" />
import NextAuth from 'next-auth';
export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      id: 'fusionauth',
      name: 'FusionAuth',
      type: 'oidc',
      issuer: process.env.AUTH_FUSIONAUTH_ISSUER!,
      clientId: process.env.AUTH_FUSIONAUTH_CLIENT_ID!,
      clientSecret: process.env.AUTH_FUSIONAUTH_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'offline_access email openid profile',
          tenantId: process.env.AUTH_FUSIONAUTH_TENANT_ID!,
        },
      },
      userinfo: `${process.env.AUTH_FUSIONAUTH_ISSUER}/oauth2/userinfo`,
      // This is due to a known processing issue
      // TODO: https://github.com/nextauthjs/next-auth/issues/8745#issuecomment-1907799026
      token: {
        url: `${process.env.AUTH_FUSIONAUTH_ISSUER}/oauth2/token`,
        conform: async (response: Response) => {
          if (response.status === 401) return response;

          const newHeaders = Array.from(response.headers.entries())
            .filter(([key]) => key.toLowerCase() !== 'www-authenticate')
            .reduce(
              (headers, [key, value]) => (headers.append(key, value), headers),
              new Headers()
            );

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
          });
        },
      },
    },
  ],
  session: {
    strategy: 'jwt',
  },
  // Required to get the account object in the session and enable
  // the ability to call API's externally that rely on JWT tokens.
  callbacks: {
    async jwt(params) {
      const { token, user, account } = params;
      if (account) {
        // First-time login, save the `access_token`, its expiry and the `refresh_token`
        return {
          ...token,
          ...account,
        };
      } else if (
        token.expires_at &&
        Date.now() < (token.expires_at as number) * 1000
      ) {
        // Subsequent logins, but the `access_token` is still valid
        return token;
      } else {
        // Subsequent logins, but the `access_token` has expired, try to refresh it
        if (!token.refresh_token) throw new TypeError('Missing refresh_token');

        try {
          const refreshResponse = await fetch(
            `${process.env.AUTH_FUSIONAUTH_ISSUER}/oauth2/token`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: new URLSearchParams({
                client_id: process.env.AUTH_FUSIONAUTH_CLIENT_ID!,
                client_secret: process.env.AUTH_FUSIONAUTH_CLIENT_SECRET!,
                grant_type: 'refresh_token',
                refresh_token: token.refresh_token as string,
              }),
            }
          );

          if (!refreshResponse.ok) {
            throw new Error('Failed to refresh token');
          }

          const tokensOrError = await refreshResponse.json();

          if (!refreshResponse.ok) throw tokensOrError;

          const newTokens = tokensOrError as {
            access_token: string;
            expires_in: number;
            refresh_token?: string;
          };

          return {
            ...token,
            access_token: newTokens.access_token,
            expires_at: Math.floor(Date.now() / 1000 + newTokens.expires_in),
            // Some providers only issue refresh tokens once, so preserve if we did not get a new one
            refresh_token: newTokens.refresh_token
              ? newTokens.refresh_token
              : token.refresh_token,
          };
        } catch (error) {
          console.error('Error refreshing access_token', error);
          // If we fail to refresh the token, return an error so we can handle it on the page
          token.error = 'RefreshTokenError';
          return token;
        }
      }
    },
    async session(params) {
      const { session, token } = params;
      return { ...session, ...token };
    },
  },
});

declare module 'next-auth' {
  interface Session {
    access_token: string;
    expires_in: number;
    id_token?: string;
    expires_at: number;
    refresh_token?: string;
    refresh_token_id?: string;
    error?: 'RefreshTokenError';
    scope: string;
    token_type: string;
    userId: string;
    provider: string;
    type: string;
    providerAccountId: string;
  }
}

declare module 'next-auth' {
  interface JWT {
    access_token: string;
    expires_in: number;
    id_token?: string;
    expires_at: number;
    refresh_token?: string;
    refresh_token_id?: string;
    error?: 'RefreshTokenError';
    scope: string;
    token_type: string;
    userId: string;
    provider: string;
    type: string;
    providerAccountId: string;
  }
}

 * 
 * 
 * 
 */
export default function FusionAuth<P extends FusionAuthProfile>(
  // tenantId only needed if there is more than one tenant configured on the server
  options: OAuthUserConfig<P> & { tenantId?: string }
): OAuthConfig<P> {
  return {
    id: "fusionauth",
    name: "FusionAuth",
    type: "oidc",
    issuer: options.issuer,
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    wellKnown: options?.tenantId
      ? `${options.issuer}/.well-known/openid-configuration?tenantId=${options.tenantId}`
      : `${options.issuer}/.well-known/openid-configuration`,
    authorization: {
      params: {
        scope: "openid offline_access email profile",
        ...(options?.tenantId && { tenantId: options.tenantId }),
      },
    },
    userinfo: `${options.issuer}/oauth2/userinfo`,
    // This is due to a known processing issue
    // TODO: https://github.com/nextauthjs/next-auth/issues/8745#issuecomment-1907799026
    token: {
      url: `${options.issuer}/oauth2/token`,
      conform: async (response: Response) => {
        if (response.status === 401) return response

        const newHeaders = Array.from(response.headers.entries())
          .filter(([key]) => key.toLowerCase() !== "www-authenticate")
          .reduce(
            (headers, [key, value]) => (headers.append(key, value), headers),
            new Headers()
          )

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        })
      },
    },
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.sub,
        email: profile.email,
        name:
          profile.name ??
          profile.preferred_username ??
          [profile.given_name, profile.middle_name, profile.family_name]
            .filter((x) => x)
            .join(" "),
        image: profile.picture,
      }
    },
    options,
  }
}
