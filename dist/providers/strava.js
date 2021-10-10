"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Strava;

function Strava(options) {
  return {
    id: "strava",
    name: "Strava",
    type: "oauth",
    version: "2.0",
    scope: "read",
    params: {
      grant_type: "authorization_code"
    },
    accessTokenUrl: "https://www.strava.com/api/v3/oauth/token",
    authorizationUrl: "https://www.strava.com/api/v3/oauth/authorize?response_type=code",
    profileUrl: "https://www.strava.com/api/v3/athlete",

    profile(profile) {
      return {
        id: profile.id,
        name: profile.firstname,
        image: profile.profile
      };
    },

    ...options
  };
}