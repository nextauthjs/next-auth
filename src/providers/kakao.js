export default (options) => {
  return {
    id: 'kakao',
    name: 'Kakao',
    type: 'oauth',
    version: '2.0',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://kauth.kakao.com/oauth/token',
    authorizationUrl: 'https://kauth.kakao.com/oauth/authorize?response_type=code',
    profileUrl: 'https://kapi.kakao.com/v2/user/me',
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.kakao_account?.profile.nickname,
        email: profile.kakao_account?.email,
        image: profile.kakao_account?.profile.profile_image_url
      }
    },
    ...options
  }
}
