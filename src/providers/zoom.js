/** @type {import(".").OAuthProvider} */
export default function Zoom(options) {
  return {
    id: 'zoom',
    name: 'Zoom',
    type: 'oauth',
    authorization: {
      url: 'https://zoom.us/oauth/authorize',
      params: { scope: '' },
    },
    token: 'https://zoom.us/oauth/token',
    userinfo: {
      url: 'https://api.zoom.us/v2/users/me',
    },
    profile(profile) {
      return {
        id: profile.id,
        name: `${profile.first_name} ${profile.last_name}`,
        email: profile.email,
        image: profile.pic_url,
      };
    },
    options,
  }
}
