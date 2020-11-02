export default (options) => {
  return {
    id: 'discord',
    name: 'Discord',
    type: 'oauth',
    version: '2.0',
    scope: 'identify email',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://discord.com/api/oauth2/token',
    authorizationUrl:
      'https://discord.com/api/oauth2/authorize?response_type=code&prompt=none',
    profileUrl: 'https://discord.com/api/users/@me',
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
