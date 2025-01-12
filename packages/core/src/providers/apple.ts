/**
 * <div class="provider" style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
 * <span style={{fontSize: "1.35rem" }}>
 *  Built-in sign in with <b>Apple</b> integration.
 * </span>
 * <a href="https://apple.com" style={{backgroundColor: "black", padding: "12px", borderRadius: "100%" }}>
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/apple.svg" width="24"/>
 * </a>
 * </div>
 *
 * @module providers/apple
 */

import { conformInternal, customFetch } from "../lib/symbols.js"
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/** The returned user profile from Apple when using the profile callback. */
export interface AppleProfile extends Record<string, any> {
  /**
   * The issuer registered claim identifies the principal that issued the identity token.
   * Since Apple generates the token, the value is `https://appleid.apple.com`.
   */
  iss: "https://appleid.apple.com"
  /**
   * The audience registered claim identifies the recipient for which the identity token is intended.
   * Since the token is meant for your application, the value is the `client_id` from your developer account.
   */
  aud: string
  /**
   * The issued at registered claim indicates the time at which Apple issued the identity token,
   * in terms of the number of seconds since Epoch, in UTC.
   */
  iat: number

  /**
   * The expiration time registered identifies the time on or after which the identity token expires,
   * in terms of number of seconds since Epoch, in UTC.
   * The value must be greater than the current date/time when verifying the token.
   */
  exp: number
  /**
   * The subject registered claim identifies the principal that's the subject of the identity token.
   * Since this token is meant for your application, the value is the unique identifier for the user.
   */
  sub: string
  /**
   * A String value used to associate a client session and the identity token.
   * This value mitigates replay attacks and is present only if passed during the authorization request.
   */
  nonce: string

  /**
   * A Boolean value that indicates whether the transaction is on a nonce-supported platform.
   * If you sent a nonce in the authorization request but don't see the nonce claim in the identity token,
   * check this claim to determine how to proceed.
   * If this claim returns true, you should treat nonce as mandatory and fail the transaction;
   * otherwise, you can proceed treating the nonce as options.
   */
  nonce_supported: boolean

  /**
   * A String value representing the user's email address.
   * The email address is either the user's real email address or the proxy address,
   * depending on their status private email relay service.
   */
  email: string

  /**
   * A String or Boolean value that indicates whether the service has verified the email.
   * The value of this claim is always true, because the servers only return verified email addresses.
   * The value can either be a String (`"true"`) or a Boolean (`true`).
   */
  email_verified: "true" | true

  /**
   * A String or Boolean value that indicates whether the email shared by the user is the proxy address.
   * The value can either be a String (`"true"` or `"false"`) or a Boolean (`true` or `false`).
   */
  is_private_email: boolean | "true" | "false"

  /**
   * An Integer value that indicates whether the user appears to be a real person.
   * Use the value of this claim to mitigate fraud. The possible values are: 0 (or Unsupported), 1 (or Unknown), 2 (or LikelyReal).
   * For more information, see [`ASUserDetectionStatus`](https://developer.apple.com/documentation/authenticationservices/asuserdetectionstatus).
   * This claim is present only on iOS 14 and later, macOS 11 and later, watchOS 7 and later, tvOS 14 and later;
   * the claim isn't present or supported for web-based apps.
   */
  real_user_status: 0 | 1 | 2

  /**
   * A String value representing the transfer identifier used to migrate users to your team.
   * This claim is present only during the 60-day transfer period after an you transfer an app.
   * For more information, see [Bringing New Apps and Users into Your Team](https://developer.apple.com/documentation/sign_in_with_apple/bringing_new_apps_and_users_into_your_team).
   */
  transfer_sub: string
  at_hash: string
  auth_time: number
  user?: AppleNonConformUser
}

/**
 * This is the shape of the `user` query parameter that Apple sends the first
 * time the user consents to the app.
 * @see https://developer.apple.com/documentation/sign_in_with_apple/request_an_authorization_to_the_sign_in_with_apple_server#4066168
 */
export interface AppleNonConformUser {
  name: {
    firstName: string
    lastName: string
  }
  email: string
}

/**
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/auth/callback/apple
 * ```
 *
 * #### Configuration
 * ```ts
 * import Apple from "@auth/core/providers/apple"
 * ...
 * providers: [
 *   Apple({
 *     clientId: env.AUTH_APPLE_ID,
 *     clientSecret: env.AUTH_APPLE_SECRET,
 *   })
 * ]
 * ...
 * ```
 *
 * ### Resources
 *
 * - Sign in with Apple [Overview](https://developer.apple.com/sign-in-with-apple/get-started/)
 * - Sign in with Apple [REST API](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api)
 * - [How to retrieve](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/authenticating_users_with_sign_in_with_apple#3383773) the user's information from Apple ID servers
 * - [Learn more about OAuth](https://authjs.dev/concepts/oauth)
 * - [Creating the Client Secret](https://developer.apple.com/documentation/accountorganizationaldatasharing/creating-a-client-secret)
 *
 * ### Notes
 *
 * - Apple does not support localhost/http URLs. You can only use a live URL with HTTPS.
 * - Apple requires the client secret to be a JWT. We provide a CLI command `npx auth add apple`, to help you generate one.
 *   This will prompt you for the necessary information and at the end it will add the `AUTH_APPLE_ID` and `AUTH_APPLE_SECRET` to your `.env` file.
 * - Apple provides minimal user information. It returns the user's email and name, but only the first time the user consents to the app.
 * - The Apple provider does not support setting up the same client for multiple deployments (like [preview deployments](https://authjs.dev/getting-started/deployment#securing-a-preview-deployment)).
 * - The Apple provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/apple.ts). To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/configuring-oauth-providers).
 *
 * ## Help
 *
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 */
export default function Apple(
  config: OAuthUserConfig<AppleProfile>
): OAuthConfig<AppleProfile> {
  return {
    id: "apple",
    name: "Apple",
    type: "oidc",
    issuer: "https://appleid.apple.com",
    authorization: {
      params: {
        scope: "name email", // https://developer.apple.com/documentation/sign_in_with_apple/clientconfigi/3230955-scope
        response_mode: "form_post",
      },
    },
    // We need to parse the special `user` parameter the first time the user consents to the app.
    // It adds the `name` object to the `profile`, with `firstName` and `lastName` fields.
    [conformInternal]: true,
    profile(profile) {
      const name = profile.user
        ? `${profile.user.name.firstName} ${profile.user.name.lastName}`
        : profile.email
      return {
        id: profile.sub,
        name: name,
        email: profile.email,
        image: null,
      }
    },
    // Apple does not provide a userinfo endpoint.
    async [customFetch](...args) {
      const url = new URL(args[0] instanceof Request ? args[0].url : args[0])
      if (url.pathname.endsWith(".well-known/openid-configuration")) {
        const response = await fetch(...args)
        const json = await response.clone().json()
        return Response.json({
          ...json,
          userinfo_endpoint: "https://appleid.apple.com/fake_endpoint",
        })
      }
      return fetch(...args)
    },
    client: { token_endpoint_auth_method: "client_secret_post" },
    style: { text: "#fff", bg: "#000" },
    checks: ["nonce", "state"],
    options: config,
  }
}
