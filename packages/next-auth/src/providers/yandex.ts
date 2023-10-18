/**
 * <div style={{backgroundColor: "#ffcc00", display: "flex", justifyContent: "space-between", color: "#000", padding: 16}}>
 * <span>Built-in <b>Yandex</b> integration.</span>
 * <a href="https://github.com">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/yandex.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * ---
 * @module providers/yandex
 */

import { OAuthConfig, OAuthUserConfig } from "."

/**
 * @see [Getting information about the user](https://yandex.com/dev/id/doc/en/user-information)
 * @see [Access to email address](https://yandex.com/dev/id/doc/en/user-information#email-access)
 * @see [Access to the user's profile picture](https://yandex.com/dev/id/doc/en/user-information#avatar-access)
 * @see [Access to the date of birth](https://yandex.com/dev/id/doc/en/user-information#birthday-access)
 * @see [Access to login, first name, last name, and gender](https://yandex.com/dev/id/doc/en/user-information#name-access)
 * @see [Access to the phone number](https://yandex.com/dev/id/doc/en/user-information#phone-access)
 */
export interface YandexProfile {
  /** User's Yandex login. */
  login: string
  /** Yandex user's unique ID. */
  id: string
  /**
   * The ID of the app the OAuth token in the request was issued for.
   * Available in the [app properties](https://oauth.yandex.com/). To open properties, click the app name.
   */
  client_id: string
  /** Authorized Yandex user ID. It is formed on the Yandex side based on the `client_id` and `user_id` pair. */
  psuid: string
  /** An array of the user's email addresses. Currently only includes the default email address. */
  emails?: string[]
  /** The default email address for contacting the user. */
  default_email?: string
  /**
   * Indicates that the stub (profile picture that is automatically assigned when registering in Yandex)
   * ID is specified in the `default_avatar_id` field.
   */
  is_avatar_empty?: boolean
  /**
   * ID of the Yandex user's profile picture.
   * The profile picture with this ID can be downloaded via a link that looks like this:
   * @example "https://avatars.yandex.net/get-yapic/31804/BYkogAC6AoB17bN1HKRFAyKiM4-1/islands-200"
   */
  default_avatar_id?:
    | "islands-small"
    | "islands-34"
    | "islands-middle"
    | "islands-50"
    | "islands-retina-small"
    | "islands-68"
    | "islands-75"
    | "islands-retina-middle"
    | "islands-retina-50"
    | "islands-200"
  /**
   * The user's date of birth in YYYY-MM-DD format.
   * Unknown elements of the date are filled in with zeros, such as: `0000-12-23`.
   * If the user's date of birth is unknow, birthday will be `null`
   */
  birthday?: string | null
  first_name?: string
  last_name?: string
  display_name?: string
  /**
   * The first and last name that the user specified in Yandex ID.
   * Non-Latin characters of the first and last names are presented in Unicode format.
   */
  real_name?: string
  /** User's gender. Possible values: Male: `male', Female: `female`, Unknown gender: `null` */
  sex?: string
  /**
   * The default phone number for contacting the user.
   * The API can exclude the user's phone number from the response at its discretion.
   * The field contains the following parameters:
   * id: Phone number ID.
   * number: The user's phone number.
   */
  default_phone?: { id: number; number: string }
}

/**
 * Add Yandex login to your page
 *
 * ## Example
 *
 * ```ts
 * import { Auth } from "@auth/core"
 * import Yandex from "@auth/core/providers/yandex"
 *
 * const request = new Request("https://example.com")
 * const response = await Auth(request, {
 *  providers: [Yandex({ clientId: "", clientSecret: "" })],
 * })
 * ```
 *
 * ## Resources
 *
 * @see [Yandex - Creating an OAuth app](https://yandex.com/dev/id/doc/en/register-client#create)
 * @see [Yandex - Manage OAuth apps](https://oauth.yandex.com/)
 * @see [Yandex - OAuth documentation](https://yandex.com/dev/id/doc/en/)
 * @see [Learn more about OAuth](https://authjs.dev/concepts/oauth)
 * @see [Source code](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/yandex.ts)
 *
 *:::tip
 * The Yandex provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/yandex.ts).
 * To override the defaults for your use case, check out [customizing a built-in OAuth provider](https://authjs.dev/guides/providers/custom-provider#override-default-options).
 * :::
 *
 * :::info **Disclaimer**
 * If you think you found a bug in the default configuration, you can [open an issue](https://authjs.dev/new/provider-issue).
 *
 * Auth.js strictly adheres to the specification and it cannot take responsibility for any deviation from
 * the spec by the provider. You can open an issue, but if the problem is non-compliance with the spec,
 * we might not pursue a resolution. You can ask for more help in [Discussions](https://authjs.dev/new/github-discussions).
 * :::
 */
export default function Yandex(
  options: OAuthUserConfig<YandexProfile>
): OAuthConfig<YandexProfile> {
  return {
    id: "yandex",
    name: "Yandex",
    type: "oauth",
    /** @see [Data access](https://yandex.com/dev/id/doc/en/register-client#access) */
    authorization:
      "https://oauth.yandex.ru/authorize?scope=login:info+login:email+login:avatar",
    token: "https://oauth.yandex.ru/token",
    userinfo: "https://login.yandex.ru/info?format=json",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.display_name ?? profile.real_name ?? profile.first_name,
        email: profile.default_email ?? profile.emails?.[0] ?? null,
        image:
          !profile.is_avatar_empty && profile.default_avatar_id
            ? `https://avatars.yandex.net/get-yapic/${profile.default_avatar_id}/islands-200`
            : null,
      }
    },
    style: {
      logo: "/yandex.svg",
      bg: "#ffcc00",
      text: "#000",
    },
    options,
  }
}
