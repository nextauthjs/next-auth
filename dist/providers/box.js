"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Box;

function Box(options) {
  return {
    id: "box",
    name: "Box",
    type: "oauth",
    version: "2.0",
    scope: "",
    params: {
      grant_type: "authorization_code"
    },
    accessTokenUrl: "https://api.box.com/oauth2/token",
    authorizationUrl: "https://account.box.com/api/oauth2/authorize?response_type=code",
    profileUrl: "https://api.box.com/2.0/users/me",

    profile(profile) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.login,
        image: profile.avatar_url
      };
    },

    ...options
  };
}