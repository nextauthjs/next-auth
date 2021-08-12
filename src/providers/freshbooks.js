export default function Freshbooks(options) {
  return {
  id: 'freshbooks',
  name: 'Freshbooks',
  type: 'oauth',
  version: '2.0',
  params: { grant_type: 'authorization_code' },
  accessTokenUrl: 'https://api.freshbooks.com/auth/oauth/token',
  authorizationUrl: 'https://auth.freshbooks.com/service/auth/oauth/authorize?response_type=code',
  profileUrl: 'https://api.freshbooks.com/auth/api/v1/users/me',
  async profile(profile) {
    return {
      id: profile.response.id,
      name: `${profile.response.first_name} ${profile.response.last_name}`,
      email: profile.response.email,
    };
  },
  ...options
  };
}
