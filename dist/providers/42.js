"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = FortyTwo;

function FortyTwo(options) {
  return {
    id: '42-school',
    name: '42 School',
    type: 'oauth',
    version: '2.0',
    params: {
      grant_type: 'authorization_code'
    },
    accessTokenUrl: 'https://api.intra.42.fr/oauth/token',
    authorizationUrl: 'https://api.intra.42.fr/oauth/authorize?response_type=code',
    profileUrl: 'https://api.intra.42.fr/v2/me',
    profile: profile => ({
      id: profile.id,
      email: profile.email,
      image: profile.image_url,
      name: profile.usual_full_name
    }),
    ...options
  };
}