"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Foursquare;

function Foursquare(options) {
  const {
    apiVersion
  } = options;
  return {
    id: "foursquare",
    name: "Foursquare",
    type: "oauth",
    version: "2.0",
    params: {
      grant_type: "authorization_code"
    },
    accessTokenUrl: "https://foursquare.com/oauth2/access_token",
    authorizationUrl: "https://foursquare.com/oauth2/authenticate?response_type=code",
    profileUrl: `https://api.foursquare.com/v2/users/self?v=${apiVersion}`,

    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.firstName} ${profile.lastName}`,
        image: `${profile.prefix}original${profile.suffix}`,
        email: profile.contact.email
      };
    },

    ...options
  };
}