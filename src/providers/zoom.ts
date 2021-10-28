import { OAuthConfig, OAuthUserConfig } from "./oauth"

export interface ZoomProfile {
  id: string
  name: string
  email: string
  image: string
}

export default function Auth0<P extends Record<string, any> = ZoomProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'zoom',
    name: 'Zoom',
    type: 'oauth',
    authorization: 'https://zoom.us/oauth/authorize?scope',
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
