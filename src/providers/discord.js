export default (options) => {
  return {
    id: 'discord',
    name: 'Discord',
    type: 'oauth',
    version: '2.0',
    scope: 'identify email',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://discord.com/api/oauth2/token',
    authorizationUrl: 'https://discord.com/api/oauth2/authorize?response_type=code&prompt=none',
    profileUrl: 'https://discord.com/api/users/@me',
    profile: (profile) => {
      if (profile.avatar === null) {
        const defaultAvatarNumber = parseInt(profile.discriminator) % 5
        profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
      } else {
        const format = profile.avatar.startsWith('a_') ? 'gif' : 'png'
        profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
      }
      return {
        id: profile.id,
        name: profile.username,
        image: profile.image_url,
        email: profile.email
      }
    },
    ...options
  }
}
