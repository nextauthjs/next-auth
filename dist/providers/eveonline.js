"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = EVEOnline;

function EVEOnline(options) {
  return {
    id: "eveonline",
    name: "EVE Online",
    type: "oauth",
    version: "2.0",
    params: {
      grant_type: "authorization_code"
    },
    accessTokenUrl: "https://login.eveonline.com/oauth/token",
    authorizationUrl: "https://login.eveonline.com/oauth/authorize?response_type=code",
    profileUrl: "https://login.eveonline.com/oauth/verify",

    profile(profile) {
      return {
        id: profile.CharacterID,
        name: profile.CharacterName,
        image: `https://image.eveonline.com/Character/${profile.CharacterID}_128.jpg`,
        email: null
      };
    },

    ...options
  };
}