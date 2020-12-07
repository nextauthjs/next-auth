import logger from '../lib/logger'

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
    async profile (profile) {
      try {
        const response = await fetch(`https://www.instagram.com/${profile.username}/?__a=1`)
        const data = await response.json()
        return {
          id: profile.id,
          name: data.graphql.user.full_name,
          email: null,
          image: data.graphql.user.profile_pic_url_hd
        }
      } catch(error) {
        logger.error("PROFILE_FETCH_ERROR", error)
      }
    },
    ...options
  }
}
