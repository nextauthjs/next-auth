import type { OAuthConfig, OAuthUserConfig } from "."

export interface DiscordProfile extends Record<string, any> {
  accent_color: number
  avatar: string
  banner: string
  banner_color: string
  discriminator: string
  email: string
  flags: number
  id: string
  image_url: string
  locale: string
  mfa_enabled: boolean
  premium_type: number
  public_flags: number
  username: string
  verified: boolean
}

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
