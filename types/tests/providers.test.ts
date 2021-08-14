import EmailProvider from "next-auth/providers/email"
import CredentialsProvider from "next-auth/providers/credentials"
import AppleProvider from "next-auth/providers/apple"
import TwitterProvider from "next-auth/providers/twitter"
import FacebookProvider from "next-auth/providers/facebook"
import GitHubProvider from "next-auth/providers/github"
import GitLabProvider from "next-auth/providers/gitlab"
import SlackProvider from "next-auth/providers/slack"
import GoogleProvider from "next-auth/providers/google"
import Auth0Provider from "next-auth/providers/auth0"
import IdentityServer4Provider from "next-auth/providers/identity-server4"
import DiscordProvider from "next-auth/providers/discord"
import TwitchProvider from "next-auth/providers/twitch"
import OktaProvider from "next-auth/providers/okta"
import OneLoginProvider from "next-auth/providers/onelogin"
import BattleNetProvider from "next-auth/providers/battlenet"
import BoxProvider from "next-auth/providers/box"
import CognitoProvider from "next-auth/providers/cognito"
import YandexProvider from "next-auth/providers/yandex"
import LinkedInProvider from "next-auth/providers/linkedin"
import SpotifyProvider from "next-auth/providers/spotify"
import RedditProvider from "next-auth/providers/reddit"
import AzureADB2CProvider from "next-auth/providers/azure-ad-b2c"
import FusionAuthProvider from "next-auth/providers/fusionauth"
import FACEITProvider from "next-auth/providers/faceit"
import InstagramProvider from "next-auth/providers/instagram"
import KakaoProvider from "next-auth/providers/kakao"
import OssoProvider from "next-auth/providers/osso"
import ZohoProvider from "next-auth/providers/zoho"
import FreshbooksProvider from "next-auth/providers/freshbooks"

// $ExpectType EmailConfig
EmailProvider({
  server: "path/to/server",
  from: "path/from",
})

// $ExpectType EmailConfig
EmailProvider({
  server: {
    host: "host",
    port: 123,
    auth: {
      user: "foo",
      pass: "123",
    },
  },
  from: "path/from",
})

// $ExpectType CredentialsConfig<{ username: { label: string; type: string; }; password: { label: string; type: string; }; }>
CredentialsProvider({
  id: "login",
  name: "account",
  credentials: {
    username: {
      label: "Password",
      type: "password",
    },
    password: {
      label: "Password",
      type: "password",
    },
  },
  async authorize({ username, password }) {
    return null
  },
})

// $ExpectType OAuthConfig<Profile>
AppleProvider({
  clientId: "foo123",
  clientSecret: {
    appleId: "foo@icloud.com",
    teamId: "foo",
    privateKey: "123xyz",
    keyId: "1234",
  },
})

// $ExpectType OAuthConfig<Profile>
TwitterProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
FacebookProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
GitHubProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
GitHubProvider({
  clientId: "foo123",
  clientSecret: "bar123",
  authorization: { params: { scope: "change:thing read:that" } },
})

// $ExpectType OAuthConfig<Profile>
GitLabProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
SlackProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
GoogleProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
GoogleProvider({
  clientId: "foo123",
  clientSecret: "bar123",
  authorization: "https://foo.google.com",
})

// $ExpectType OAuthConfig<Profile>
Auth0Provider({
  clientId: "foo123",
  clientSecret: "bar123",
  issuer: "https://foo.auth0.com",
})

// $ExpectType OAuthConfig<Profile>
Auth0Provider({
  clientId: "foo123",
  clientSecret: "bar123",
  issuer: "https://foo.auth0.com",
  profile() {
    return {
      id: "foo123",
      name: "foo",
      email: "foo@bar.io",
      image: "https://foo.auth0.com/image/1.png",
    }
  },
})

// $ExpectType OAuthConfig<Profile>
IdentityServer4Provider({
  id: "identity-server4",
  name: "IdentityServer4",
  authorization: { params: { scope: "change:thing read:that" } },
  issuer: "https://foo.is4.com",
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
DiscordProvider({
  clientId: "foo123",
  clientSecret: "bar123",
  authorization: { params: { scope: "identify" } },
})

// $ExpectType OAuthConfig<Profile>
TwitchProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
OktaProvider({
  clientId: "foo123",
  clientSecret: "bar123",
  issuer: "https://foo.auth0.com",
})

// $ExpectType OAuthConfig<Profile>
OneLoginProvider({
  clientId: "foo123",
  clientSecret: "bar123",
  issuer: "https://foo.onelogin.com",
})

// $ExpectType OAuthConfig<Profile>
BattleNetProvider({
  clientId: "foo123",
  clientSecret: "bar123",
  region: "europe",
})

// $ExpectType OAuthConfig<Profile>
BoxProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
CognitoProvider({
  clientId: "foo123",
  clientSecret: "bar123",
  issuer: "https://foo.auth0.com",
})

// $ExpectType OAuthConfig<Profile>
YandexProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
LinkedInProvider({
  clientId: "foo123",
  clientSecret: "bar123",
  authorization: { params: { scope: "r_emailaddress r_liteprofile" } },
})

// $ExpectType OAuthConfig<Profile>
SpotifyProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
SpotifyProvider({
  clientId: "foo123",
  clientSecret: "bar123",
  authorization: { params: { scope: "user-read-email" } },
})

// $ExpectType OAuthConfig<Profile>
RedditProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
AzureADB2CProvider({
  clientId: "foo123",
  clientSecret: "bar123",
  authorization: { params: { scope: "offline_access User.Read" } },
  tenantId: "tenantId",
  idToken: true,
})

// $ExpectType OAuthConfig<Profile>
FusionAuthProvider({
  name: "FusionAuth",
  issuer: "domain",
  clientId: "clientId",
  clientSecret: "clientSecret",
  tenantId: "tenantId",
})

// $ExpectType OAuthConfig<Profile>
FACEITProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
InstagramProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
KakaoProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
OssoProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
ZohoProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType OAuthConfig<Profile>
FreshbooksProvider({
  clientId: "foo123",
  clientSecret: "bar123",
})
