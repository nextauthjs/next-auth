// Snapchat doesn't return an email address, currently not supported
export default (options) => {
  return {
    id: 'snapchat',
    name: 'Snapchat',
    type: 'oauth',
    version: '2.0',
    scope: 'user.display_name user.bitmoji.avatar user.external_id',
    params: { grant_type: 'authorization_code' },
    accessTokenUrl: 'https://accounts.snapchat.com/accounts/oauth2/token',
    authorizationUrl:
      'https://accounts.snapchat.com/accounts/oauth2/auth?response_type=code',
    profileUrl: 'https://kit.snapchat.com/v1/me',
    profile: (profile) => {
      // return {
      //   id: profile.id,
      //   name: profile.battletag,
      // };
    },
    ...options,
  };
};
