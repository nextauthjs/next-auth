export default function Kakao(options) {
  return {
    id: "kakao",
    name: "Kakao",
    type: "oauth",
    authorization: "https://kauth.kakao.com/oauth/authorize",
    token: "https://kauth.kakao.com/oauth/token",
    userinfo: "https://kapi.kakao.com/v2/user/me",
    profile(profile) {
      return {
        id: profile.id,
        name: profile.kakao_account?.profile.nickname,
        email: profile.kakao_account?.email,
        image: profile.kakao_account?.profile.profile_image_url,
      }
    },
    options,
  }
}
