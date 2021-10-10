"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Twitch;

function Twitch(options) {
  return {
    id: "twitch",
    name: "Twitch",
    type: "oauth",
    version: "2.0",
    scope: "user:read:email",
    params: {
      grant_type: "authorization_code"
    },
    accessTokenUrl: "https://id.twitch.tv/oauth2/token",
    authorizationUrl: "https://id.twitch.tv/oauth2/authorize?response_type=code",
    profileUrl: "https://api.twitch.tv/helix/users",

    profile(profile) {
      const data = profile.data[0];
      return {
        id: data.id,
        name: data.display_name,
        image: data.profile_image_url,
        email: data.email
      };
    },

    ...options
  };
}