export default function Mailchimp(options) {
  return {
    id: 'mailchimp',
    name: 'Mailchimp',
    type: 'oauth',
    version: '2.0',
    scope: '',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://login.mailchimp.com/oauth2/token',
    authorizationUrl: 'https://login.mailchimp.com/oauth2/authorize?response_type=code',
    profileUrl: 'https://login.mailchimp.com/oauth2/metadata',
    profile: (profile) => {
      return {
        id: profile.login.login_id,
        name: profile.accountname,
        email: profile.login.email,
        image: null
      }
    },
    ...options
  }
}
