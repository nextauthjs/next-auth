"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Spotify;

function Spotify(options) {
  return {
    id: "spotify",
    name: "Spotify",
    type: "oauth",
    version: "2.0",
    scope: "user-read-email",
    params: {
      grant_type: "authorization_code"
    },
    accessTokenUrl: "https://accounts.spotify.com/api/token",
    authorizationUrl: "https://accounts.spotify.com/authorize?response_type=code",
    profileUrl: "https://api.spotify.com/v1/me",

    profile(profile) {
      var _profile$images, _profile$images$;

      return {
        id: profile.id,
        name: profile.display_name,
        email: profile.email,
        image: (_profile$images = profile.images) === null || _profile$images === void 0 ? void 0 : (_profile$images$ = _profile$images[0]) === null || _profile$images$ === void 0 ? void 0 : _profile$images$.url
      };
    },

    ...options
  };
}