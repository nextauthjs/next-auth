"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Apple;

function Apple(options) {
  return {
    id: "apple",
    name: "Apple",
    type: "oauth",
    version: "2.0",
    scope: "name email",
    params: {
      grant_type: "authorization_code"
    },
    accessTokenUrl: "https://appleid.apple.com/auth/token",
    authorizationUrl: "https://appleid.apple.com/auth/authorize?response_type=code&id_token&response_mode=form_post",
    profileUrl: null,
    idToken: true,

    profile(profile) {
      return {
        id: profile.sub,
        name: profile.user != null ? profile.user.name.firstName + " " + profile.user.name.lastName : null,
        email: profile.email
      };
    },

    clientId: null,
    clientSecret: {
      teamId: null,
      privateKey: null,
      keyId: null
    },
    protection: "none",
    ...options
  };
}