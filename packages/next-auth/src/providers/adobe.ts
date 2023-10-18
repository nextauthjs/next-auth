import type { OAuthConfig, OAuthUserConfig } from '.'

export interface AdobeProfile extends Record<string, any> {
  aud: string
  azp: string
  email: string
  email_verified: boolean
  exp: number
  family_name: string
  given_name: string
  hd: string
  iat: number
  iss: string
  jti: string
  name: string
  nbf: number
  image: string
  sub: string
}

export default function Adobe<P extends AdobeProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: 'adobe',
    name: 'Adobe',
    type: 'oauth',
    version: '2.0',
    wellKnown:
      'https://ims-na1.adobelogin.com/ims/.well-known/openid-configuration',
    authorization: {
      url: 'https://ims-na1.adobelogin.com/ims/authorize/v2',
      params: {
        scope: 'openid address creative_sdk email profile',
        redirect_uri: ''
      }
    },
    idToken: true,
    token: 'https://ims-na1.adobelogin.com/ims/token/v3',
    userinfo: 'https://ims-na1.adobelogin.com/ims/userinfo/v2',
    issuer: 'https://ims-na1.adobelogin.com',
    profile(adobeStockProfile) {
      return {
        id: adobeStockProfile.email,
        email: adobeStockProfile.email,
        image: adobeStockProfile.image,
        email_verified: adobeStockProfile.email_verified,
        given_name: adobeStockProfile.given_name,
        family_name: adobeStockProfile.family_name
      }
    },
    style: {
      logo: '/adobe.svg',
      logoDark: '/adobe.svg',
      bgDark: '#fff',
      bg: '#fff',
      text: '#000',
      textDark: '#000'
    },
    ...options
    // Add the following in options
    // signinUrl:
    //   process.env.NODE_ENV === 'development'
    //     ? 'https://localhost:3001/api/auth/signin/adobe'
    //     : undefined,
    // callbackUrl:
    //   process.env.NODE_ENV === 'development'
    //     ? 'https://localhost:3001/api/auth/callback/adobe'
    //     : undefined,
    // authorization: {
    //   url: 'https://ims-na1.adobelogin.com/ims/authorize/v2',
    //   params: {
    //     scope: 'openid address creative_sdk email profile',
    //     redirect_uri: ''
    //   }
    // },
    // clientId: process.env.ADOBE_CLIENT_ID,
    // clientSecret: process.env.ADOBE_CLIENT_SECRET
  }
}
