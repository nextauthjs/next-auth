"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Zoho;

function Zoho(options) {
  return {
    id: "zoho",
    name: "Zoho",
    type: "oauth",
    version: "2.0",
    scope: "AaaServer.profile.Read",
    params: {
      grant_type: "authorization_code"
    },
    accessTokenUrl: "https://accounts.zoho.com/oauth/v2/token",
    authorizationUrl: "https://accounts.zoho.com/oauth/v2/auth?response_type=code",
    profileUrl: "https://accounts.zoho.com/oauth/user/info",

    profile(profile) {
      return {
        id: profile.ZUID,
        name: `${profile.First_Name} ${profile.Last_Name}`,
        email: profile.Email,
        image: null
      };
    },

    ...options
  };
}