import type { OAuthConfig, OAuthUserConfig } from "."

export interface GoogleProfile extends Record<string, any> {
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
  picture: string
  sub: string
}

export default function Google<P extends GoogleProfile>(
  options: OAuthUserConfig<P>
): OAuthConfig<P> {
  return {
    id: "google",
    name: "Google",
    type: "oauth",
    wellKnown: "https://accounts.google.com/.well-known/openid-configuration",
    authorization: { params: { scope: "openid email profile" } },
    idToken: true,
    checks: ["pkce", "state"],
    profile(profile) {
      return {
        id: profile.sub,
        name: profile.name,
        email: profile.email,
        image: profile.picture,
      }
    },
    style: {
      logo: `<svg xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 46 46">
  <title>btn_google_light_normal_ios</title>
  <defs>
    <filter id="filter-1" width="200%" height="200%" x="-50%" y="-50%" filterUnits="objectBoundingBox">
      <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/>
      <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation=".5"/>
      <feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.168 0"/>
      <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2"/>
      <feGaussianBlur in="shadowOffsetOuter2" result="shadowBlurOuter2" stdDeviation=".5"/>
      <feColorMatrix in="shadowBlurOuter2" result="shadowMatrixOuter2" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.084 0"/>
      <feMerge>
        <feMergeNode in="shadowMatrixOuter1"/>
        <feMergeNode in="shadowMatrixOuter2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <rect id="path-2" width="40" height="40" x="0" y="0" rx="2"/>
  </defs>
  <g id="Google-Button" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
    <g id="btn_google_light_normal" transform="translate(-1.000000, -1.000000)">
      <g id="button" filter="url(#filter-1)" transform="translate(4.000000, 4.000000)">
        <g id="button-bg">
          <use fill="#FFF" fill-rule="evenodd" xlink:href="#path-2"/>
          <use fill="none" xlink:href="#path-2"/>
          <use fill="none" xlink:href="#path-2"/>
          <use fill="none" xlink:href="#path-2"/>
        </g>
      </g>
      <g id="logo_googleg_48dp" transform="translate(15.000000, 15.000000)">
        <path id="Shape" fill="#4285F4" d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"/>
        <path id="Shape" fill="#34A853" d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"/>
        <path id="Shape" fill="#FBBC05" d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"/>
        <path id="Shape" fill="#EA4335" d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"/>
        <path id="Shape" d="M0,0 L18,0 L18,18 L0,18 L0,0 Z"/>
      </g>
    </g>
  </g>
</svg>`,
      logoDark: `<svg xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 46 46">
  <title>btn_google_dark_normal_ios</title>
  <defs>
    <filter id="filter-1" width="200%" height="200%" x="-50%" y="-50%" filterUnits="objectBoundingBox">
      <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"/>
      <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation=".5"/>
      <feColorMatrix in="shadowBlurOuter1" result="shadowMatrixOuter1" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.168 0"/>
      <feOffset dx="0" dy="0" in="SourceAlpha" result="shadowOffsetOuter2"/>
      <feGaussianBlur in="shadowOffsetOuter2" result="shadowBlurOuter2" stdDeviation=".5"/>
      <feColorMatrix in="shadowBlurOuter2" result="shadowMatrixOuter2" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.084 0"/>
      <feMerge>
        <feMergeNode in="shadowMatrixOuter1"/>
        <feMergeNode in="shadowMatrixOuter2"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <rect id="path-2" width="40" height="40" x="0" y="0" rx="2"/>
    <rect id="path-3" width="38" height="38" x="5" y="5" rx="1"/>
  </defs>
  <g id="Google-Button" fill="none" fill-rule="evenodd" stroke="none" stroke-width="1">
    <g id="btn_google_dark_normal" transform="translate(-1.000000, -1.000000)">
      <g id="button" filter="url(#filter-1)" transform="translate(4.000000, 4.000000)">
        <g id="button-bg">
          <use fill="#4285F4" fill-rule="evenodd" xlink:href="#path-2"/>
          <use fill="none" xlink:href="#path-2"/>
          <use fill="none" xlink:href="#path-2"/>
          <use fill="none" xlink:href="#path-2"/>
        </g>
      </g>
      <g id="button-bg-copy">
        <use fill="#FFF" fill-rule="evenodd" xlink:href="#path-3"/>
        <use fill="none" xlink:href="#path-3"/>
        <use fill="none" xlink:href="#path-3"/>
        <use fill="none" xlink:href="#path-3"/>
      </g>
      <g id="logo_googleg_48dp" transform="translate(15.000000, 15.000000)">
        <path id="Shape" fill="#4285F4" d="M17.64,9.20454545 C17.64,8.56636364 17.5827273,7.95272727 17.4763636,7.36363636 L9,7.36363636 L9,10.845 L13.8436364,10.845 C13.635,11.97 13.0009091,12.9231818 12.0477273,13.5613636 L12.0477273,15.8195455 L14.9563636,15.8195455 C16.6581818,14.2527273 17.64,11.9454545 17.64,9.20454545 L17.64,9.20454545 Z"/>
        <path id="Shape" fill="#34A853" d="M9,18 C11.43,18 13.4672727,17.1940909 14.9563636,15.8195455 L12.0477273,13.5613636 C11.2418182,14.1013636 10.2109091,14.4204545 9,14.4204545 C6.65590909,14.4204545 4.67181818,12.8372727 3.96409091,10.71 L0.957272727,10.71 L0.957272727,13.0418182 C2.43818182,15.9831818 5.48181818,18 9,18 L9,18 Z"/>
        <path id="Shape" fill="#FBBC05" d="M3.96409091,10.71 C3.78409091,10.17 3.68181818,9.59318182 3.68181818,9 C3.68181818,8.40681818 3.78409091,7.83 3.96409091,7.29 L3.96409091,4.95818182 L0.957272727,4.95818182 C0.347727273,6.17318182 0,7.54772727 0,9 C0,10.4522727 0.347727273,11.8268182 0.957272727,13.0418182 L3.96409091,10.71 L3.96409091,10.71 Z"/>
        <path id="Shape" fill="#EA4335" d="M9,3.57954545 C10.3213636,3.57954545 11.5077273,4.03363636 12.4404545,4.92545455 L15.0218182,2.34409091 C13.4631818,0.891818182 11.4259091,0 9,0 C5.48181818,0 2.43818182,2.01681818 0.957272727,4.95818182 L3.96409091,7.29 C4.67181818,5.16272727 6.65590909,3.57954545 9,3.57954545 L9,3.57954545 Z"/>
        <path id="Shape" d="M0,0 L18,0 L18,18 L0,18 L0,0 Z"/>
      </g>
    </g>
  </g>
</svg>`,
      bgDark: "#4285F4",
      bg: "#fff",
      text: "#000",
      textDark: "#fff",
    },
    options,
  }
}
