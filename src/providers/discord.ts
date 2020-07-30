import { ProviderReturnConfig, ProviderBasicOptions } from "../interfaces"

export interface ProviderDiscordOptions extends ProviderBasicOptions {}

export default (options: ProviderDiscordOptions): ProviderReturnConfig => {
  return {
    id: 'discord',
    name: 'Discord',
    type: 'oauth',
    version: '2.0',
    scope: 'identify email',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://discordapp.com/api/oauth2/token',
    authorizationUrl:
      'https://discordapp.com/api/oauth2/authorize?response_type=code&prompt=consent',
    profileUrl: 'https://discordapp.com/api/users/@me',
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.username,
        image: `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`,
        email: profile.email
      }
    },
    ...options
  }
}
