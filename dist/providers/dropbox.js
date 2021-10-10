"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Dropbox;

function Dropbox(options) {
  return {
    id: 'dropbox',
    name: 'Dropbox',
    type: 'oauth',
    version: '2.0',
    scope: 'account_info.read',
    params: {
      grant_type: 'authorization_code'
    },
    accessTokenUrl: 'https://api.dropboxapi.com/oauth2/token',
    authorizationUrl: 'https://www.dropbox.com/oauth2/authorize?token_access_type=offline&response_type=code',
    profileUrl: 'https://api.dropboxapi.com/2/users/get_current_account',
    profile: profile => {
      return {
        id: profile.account_id,
        name: profile.name.display_name,
        email: profile.email,
        image: profile.profile_photo_url,
        email_verified: profile.email_verified
      };
    },
    protection: ["state", "pkce"],
    ...options
  };
}