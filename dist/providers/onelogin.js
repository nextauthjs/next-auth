"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = OneLogin;

function OneLogin(options) {
  return {
    id: "onelogin",
    name: "OneLogin",
    type: "oauth",
    version: "2.0",
    scope: "openid profile name email",
    params: {
      grant_type: "authorization_code"
    },
    accessTokenUrl: `https://${options.domain}/oidc/2/token`,
    requestTokenUrl: `https://${options.domain}/oidc/2/auth`,
    authorizationUrl: `https://${options.domain}/oidc/2/auth?response_type=code`,
    profileUrl: `https://${options.domain}/oidc/2/me`,

    profile(profile) {
      return { ...profile,
        id: profile.sub
      };
    },

    ...options
  };
}