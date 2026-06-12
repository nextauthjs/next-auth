/**
 * <div class="provider" style={{backgroundColor: "#3370ff", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Feishu</b> integration.</span>
 * <a href="https://www.feishu.cn">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/feishu.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/feishu
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js";
/**
 * The Feishu profile returned from the API
 *
 * @see https://open.feishu.cn/document/server-docs/authentication-management/login-state-management/get
 */
export interface FeishuProfile {
  /** The user's display name */
  name: string;
  /** The user's English name */
  en_name: string;
  /** The user's avatar URLs */
  avatar_url: string;
  avatar_thumb: string;
  avatar_middle: string;
  avatar_big: string;
  /** The user's Feishu IDs */
  open_id: string;
  union_id: string;
  /** The user's email address */
  email: string;
  /** The user's enterprise email address */
  enterprise_email: string;
  /** The user's unique ID */
  user_id: string;
  /** The user's mobile phone number */
  mobile: string;
  /** The tenant key */
  tenant_key: string;
  /** The user's employee number */
  employee_no: string;
}

export interface FeishuOptions extends OAuthUserConfig<FeishuProfile> {
  callbackUrl: string;
}

/**
 * The parameters for the token request
 *
 * @see https://open.feishu.cn/document/authentication-management/access-token/obtain-oauth-code
 */
interface TokenRequestParams {
  /** The authorization code received from the authorization endpoint */
  code: string;
  /** The client ID of the OAuth application */
  client_id: string;
  /** The client secret of the OAuth application */
  client_secret: string;
  /** The redirect URI used in the authorization request */
  redirect_uri: string;
  /** The code verifier used for PKCE (Proof Key for Code Exchange) */
  code_verifier: string;
  /** The grant type, typically "authorization_code" */
  grant_type: string;
  /** The scope of the OAuth application */
  scope: string;
}

/**
 * The response from the token endpoint
 *
 * @see https://open.feishu.cn/document/authentication-management/access-token/get-user-access-token
 */
interface TokenResponse {
  /** Error code, 0 indicates success, non-zero indicates failure */
  code?: number;
  /** User access token, only returned on success */
  access_token?: string;
  /** Access token expiration time in seconds, only returned on success */
  expires_in?: number;
  /** Refresh token, only returned on success and when offline_access is authorized */
  refresh_token?: string;
  /** Refresh token expiration time in seconds, only returned with refresh_token */
  refresh_token_expires_in?: number;
  /** Token type, always "Bearer" on success */
  token_type?: string;
  /** List of permissions granted to the access token, only returned on success */
  scope?: string;
  /** Error type, only returned on failure */
  error?: string;
  /** Detailed error message, only returned on failure */
  error_description?: string;
}

/**
 * Add Feishu login to your page and make requests to [Feishu APIs](https://open.feishu.cn/document/sso/web-application-sso/login-overview).
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/feishu
 * ```
 *
 * #### Configuration
 * ```ts
 * import NextAuth from "next-auth";
 * import Feishu from "@auth/core/providers/feishu";
 * 
 * declare module "next-auth" {
 *   interface Session {
 *     accessToken?: string;
 *   }
 * }
 * 
 * export const { handlers, signIn, signOut, auth } = NextAuth({
 *   providers: [
 *     Feishu({
 *       clientId: process.env.FEISHU_CLIENT_ID!,
 *       clientSecret: process.env.FEISHU_CLIENT_SECRET!,
 *       callbackUrl: `${process.env.NEXTAUTH_URL}/api/auth/callback/feishu`,
 *     }),
 *   ],
 * });
 * ```
 *
 * ### Resources
 *
 * - [Feishu - Creating an OAuth App](https://open.feishu.cn/document/sso/web-application-sso/login-overview)
 * - [Feishu - Authorizing OAuth Apps](https://open.feishu.cn/document/authentication-management/access-token/obtain-oauth-code)
 * - [Feishu - Configure your Feishu OAuth Apps](https://open.feishu.cn/app)
 * - [Learn more about OAuth](https://authjs.dev/concepts/oauth)
 * - [Source code](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/feishu.ts)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Feishu provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Feishu provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/feishu.ts).
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
 */

export default function Feishu(options: FeishuOptions): OAuthConfig<FeishuProfile>{
  return {
    id: "feishu",
    name: "Feishu",
    type: "oauth",
    authorization: {
      url: "https://accounts.feishu.cn/open-apis/authen/v1/authorize",
      params: {
        client_id: options.clientId,
        response_type: "code",
      },
    },
    token: {
      url: "https://open.feishu.cn/open-apis/authen/v2/oauth/token",
      async request({ params }: { params: TokenRequestParams }) {
        const payload = {
          grant_type: "authorization_code",
          code: params.code,
          client_id: options.clientId,
          client_secret: options.clientSecret,
          redirect_uri: options.callbackUrl,
          code_verifier: params.code_verifier,
          scope: params.scope,
        };

        const response = await fetch("https://open.feishu.cn/open-apis/authen/v2/oauth/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (data.code !== 0 || data.error) {
          throw new Error(
            data.error_description ||
              data.error ||
              `Failed to get access token: ${JSON.stringify(data)}`,
          );
        }

        return {
          tokens: {
            access_token: data.access_token,
            token_type: data.token_type || "Bearer",
            expires_in: data.expires_in,
            refresh_token: data.refresh_token,
            scope: data.scope,
          },
        };
      },
    },
    userinfo: {
      url: "https://open.feishu.cn/open-apis/authen/v1/user_info",
      async request({ tokens }: { tokens: TokenResponse }) {
        const response = await fetch("https://open.feishu.cn/open-apis/authen/v1/user_info", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
          },
        });

        const data = await response.json();

        if (data.code !== 0) {
          throw new Error(`Failed to get user info: ${data.msg || JSON.stringify(data)}`);
        }

        return data.data satisfies FeishuProfile;
      },
    },
    profile(profile: FeishuProfile) {
      return profile;
    },
    options,
  };
}
