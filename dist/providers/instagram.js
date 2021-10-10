"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Instagram;

function Instagram(options) {
  return {
    id: "instagram",
    name: "Instagram",
    type: "oauth",
    version: "2.0",
    scope: "user_profile",
    params: {
      grant_type: "authorization_code"
    },
    accessTokenUrl: "https://api.instagram.com/oauth/access_token",
    authorizationUrl: "https://api.instagram.com/oauth/authorize?response_type=code",
    profileUrl: "https://graph.instagram.com/me?fields=id,username,account_type,name",

    async profile(profile) {
      return {
        id: profile.id,
        name: profile.username,
        email: null,
        image: null
      };
    },

    ...options
  };
}