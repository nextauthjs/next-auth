"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Okta;

function Okta(options) {
  return {
    id: "okta",
    name: "Okta",
    type: "oauth",
    version: "2.0",
    scope: "openid profile email",
    params: {
      grant_type: "authorization_code",
      client_id: options.clientId,
      client_secret: options.clientSecret
    },
    accessTokenUrl: `https://${options.domain}/v1/token`,
    authorizationUrl: `https://${options.domain}/v1/authorize/?response_type=code`,
    profileUrl: `https://${options.domain}/v1/userinfo/`,

    profile(profile) {
      return { ...profile,
        id: profile.sub
      };
    },

    ...options
  };
}