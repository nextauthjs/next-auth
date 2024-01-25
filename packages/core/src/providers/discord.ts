/**
 * <div style={{backgroundColor: "#000", display: "flex", justifyContent: "space-between", color: "#fff", padding: 16}}>
 * <span>Built-in <b>Discord</b> integration.</span>
 * <a href="https://discord.com/">
 *   <img style={{display: "block"}} src="https://authjs.dev/img/providers/discord.svg" height="48" width="48"/>
 * </a>
 * </div>
 *
 * @module providers/discord
 */
import type { OAuthConfig, OAuthUserConfig } from "./index.js"

/**
 * Corresponds to the user structure documented here:
 * https://discord.com/developers/docs/resources/user#user-object-user-structure
 */
export interface DiscordProfile extends Record<string, any> {
  /** the user's id (i.e. the numerical snowflake) */
  id: string
  /** the user's username, not unique across the platform */
  username: string
  /** the user's 4-digit discord-tag */
  discriminator: string
  /**
   * the user's avatar hash:
   * https://discord.com/developers/docs/reference#image-formatting
   */
  avatar: string | null
  /** whether the user belongs to an OAuth2 application */
  bot?: boolean
  /**
   * whether the user is an Official Discord System user (part of the urgent
   * message system)
   */
  system?: boolean
  /** whether the user has two factor enabled on their account */
  mfa_enabled: boolean
  /**
   * the user's banner hash:
   * https://discord.com/developers/docs/reference#image-formatting
   */
  banner: string | null

  /** the user's banner color encoded as an integer representation of hexadecimal color code */
  accent_color: number | null

  /**
   * the user's chosen language option:
   * https://discord.com/developers/docs/reference#locales
   */
  locale: string
  /** whether the email on this account has been verified */
  verified: boolean
  /** the user's email */
  email: string | null
  /**
   * the flags on a user's account:
   * https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  flags: number
  /**
   * the type of Nitro subscription on a user's account:
   * https://discord.com/developers/docs/resources/user#user-object-premium-types
   */
  premium_type: number
  /**
   * the public flags on a user's account:
   * https://discord.com/developers/docs/resources/user#user-object-user-flags
   */
  public_flags: number
  /** undocumented field; corresponds to the user's custom nickname */
  display_name: string | null
  /**
   * undocumented field; corresponds to the Discord feature where you can e.g.
   * put your avatar inside of an ice cube
   */
  avatar_decoration: string | null
  /**
   * undocumented field; corresponds to the premium feature where you can
   * select a custom banner color
   */
  banner_color: string | null
  /** undocumented field; the CDN URL of their profile picture */
  image_url: string
}

/**
 * Add Discord login to your page.
 *
 * ### Setup
 *
 * #### Callback URL
 * ```
 * https://example.com/api/auth/callback/discord
 * ```
 *
 * #### Configuration
 *```js
 * import Auth from "@auth/core"
 * import Discord from "@auth/core/providers/discord"
 *
 * const request = new Request(origin)
 * const response = await Auth(request, {
 *   providers: [Discord({ clientId: DISCORD_CLIENT_ID, clientSecret: DISCORD_CLIENT_SECRET })],
 * })
 * ```
 *
 * ### Resources
 *
 *  - [Discord OAuth documentation](https://discord.com/developers/docs/topics/oauth2)
 *  - [Discord OAuth apps](https://discord.com/developers/applications)
 *
 * ### Notes
 *
 * By default, Auth.js assumes that the Discord provider is
 * based on the [OAuth 2](https://www.rfc-editor.org/rfc/rfc6749.html) specification.
 *
 * :::tip
 *
 * The Discord provider comes with a [default configuration](https://github.com/nextauthjs/next-auth/blob/main/packages/core/src/providers/discord.ts).
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
export default function Discord<P extends DiscordProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "discord",
    name: "Discord",
    type: "oauth",
    authorization:
      "https://discord.com/api/oauth2/authorize?scope=identify+email",
    token: "https://discord.com/api/oauth2/token",
    userinfo: "https://discord.com/api/users/@me",
    profile(profile) {
      if (profile.avatar === null) {
        const defaultAvatarNumber = parseInt(profile.discriminator) % 5
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
      } else {
        const format = profile.avatar.startsWith("a_") ? "gif" : "png"
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
      }
      return {
        id: profile.id,
        name: profile.username,
        email: profile.email,
        image: profile.image_url,
      }
    },
    style: { logo: "/discord.svg", bg: "#5865F2", text: "#fff" },
    options,
  }
}
