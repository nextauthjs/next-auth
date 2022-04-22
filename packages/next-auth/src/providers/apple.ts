import { OAuthConfig, OAuthUserConfig } from "."

/**
 * See more at:
 * [Retrieve the User's Information from Apple ID Servers
](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/authenticating_users_with_sign_in_with_apple#3383773)
 */
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
}

export default function Apple<P extends AppleProfile>(
  options: Omit<OAuthUserConfig<P>, "clientSecret"> & {
    /**
     * Apple requires the client secret to be a JWT. You can generate one using the following script:
     * https://bal.so/apple-gen-secret
     * 
     * Read more: [Creating the Client Secret
](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens#3262048)
     */
    clientSecret: string
  }
): OAuthConfig<P> {
  return {
    id: "apple",
    name: "Apple",
    type: "oauth",
    wellKnown: "https://appleid.apple.com/.well-known/openid-configuration",
    authorization: {
      params: { scope: "name email", response_mode: "form_post" },
    },
    idToken: true,
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: null,
      }
    },
    checks: ["pkce"],
    options,
  }
}
