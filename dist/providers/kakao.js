"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = Kakao;

function Kakao(options) {
  return {
    id: "kakao",
    name: "Kakao",
    type: "oauth",
    version: "2.0",
    params: {
      grant_type: "authorization_code"
    },
    accessTokenUrl: "https://kauth.kakao.com/oauth/token",
    authorizationUrl: "https://kauth.kakao.com/oauth/authorize?response_type=code",
    profileUrl: "https://kapi.kakao.com/v2/user/me",

    profile(profile) {
      var _profile$kakao_accoun, _profile$kakao_accoun2, _profile$kakao_accoun3;

      return {
        id: profile.id,
        name: (_profile$kakao_accoun = profile.kakao_account) === null || _profile$kakao_accoun === void 0 ? void 0 : _profile$kakao_accoun.profile.nickname,
        email: (_profile$kakao_accoun2 = profile.kakao_account) === null || _profile$kakao_accoun2 === void 0 ? void 0 : _profile$kakao_accoun2.email,
        image: (_profile$kakao_accoun3 = profile.kakao_account) === null || _profile$kakao_accoun3 === void 0 ? void 0 : _profile$kakao_accoun3.profile.profile_image_url
      };
    },

    ...options
  };
}