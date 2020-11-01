import fetch from 'node-fetch'

export default (options) => {
  return {
    id: 'instagram',
    name: 'Instagram',
    type: 'oauth',
    version: '2.0',
    scope: 'user_profile',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://api.instagram.com/oauth/access_token',
    authorizationUrl: 'https://api.instagram.com/oauth/authorize?response_type=code',
    profileUrl: 'https://graph.instagram.com/me?fields=id,username,account_type,name',
    profile: async (profile) => {
      const instagramData = await fetch('https://www.instagram.com/' + profile.username + '/?__a=1').then(res => res.json())
      return {
        id: profile.id,
        name: instagramData.graphql.user.full_name,
        email: null,
        image: instagramData.graphql.user.profile_pic_url_hd
      }
    },
    ...options
  }
}
