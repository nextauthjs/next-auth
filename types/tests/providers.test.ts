import Providers from "next-auth/providers"

// $ExpectType NonNullParams<ProviderEmailOptions> & { id: "email"; type: "email"; }
Providers.Email({
  server: "path/to/server",
  from: "path/from",
})

// $ExpectType NonNullParams<ProviderEmailOptions> & { id: "email"; type: "email"; }
Providers.Email({
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

// $ExpectType NonNullParams<ProviderCredentialsOptions> & { id: "credentials"; type: "credentials"; }
Providers.Credentials({
  id: "login",
  name: "account",
  credentials: {
    user: {
      label: "Password",
      type: "password",
    },
    password: {
      label: "Password",
      type: "password",
    },
  },
  authorize: async (credentials) => {
    const user = {
      /* fetched user */
    }
    return user
  },
})

// $ExpectType Provider<"apple", "oauth"> & { protection: "none"; }
Providers.Apple({
  clientId: "foo123",
  clientSecret: {
    appleId: "foo@icloud.com",
    teamId: "foo",
    privateKey: "123xyz",
    keyId: "1234",
  },
})

// $ExpectType Provider<"twitter", "oauth">
Providers.Twitter({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"facebook", "oauth">
Providers.Facebook({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"github", "oauth">
Providers.GitHub({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"github", "oauth">
Providers.GitHub({
  clientId: "foo123",
  clientSecret: "bar123",
  scope: "change:thing read:that",
})

// $ExpectType Provider<"gitlab", "oauth">
Providers.GitLab({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"slack", "oauth">
Providers.Slack({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"google", "oauth">
Providers.Google({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"google", "oauth">
Providers.Google({
  clientId: "foo123",
  clientSecret: "bar123",
  authorizationUrl: "https://foo.google.com",
})

// $ExpectType Provider<"auth0", "oauth"> & { domain: string; }
Providers.Auth0({
  clientId: "foo123",
  clientSecret: "bar123",
  domain: "https://foo.auth0.com",
})

// $ExpectType Provider<"auth0", "oauth"> & { domain: string; }
Providers.Auth0({
  clientId: "foo123",
  clientSecret: "bar123",
  domain: "https://foo.auth0.com",
  profile: () => ({
    id: "foo123",
    name: "foo",
    email: "foo@bar.io",
    image: "https://foo.auth0.com/image/1.png",
  }),
})

// $ExpectType Provider<string, "oauth"> & { domain: string; }
Providers.IdentityServer4({
  id: "identity-server4",
  name: "IdentityServer4",
  scope: "change:thing read:that",
  domain: "https://foo.is4.com",
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"discord", "oauth">
Providers.Discord({
  clientId: "foo123",
  clientSecret: "bar123",
  scope: "identify",
})

// $ExpectType Provider<"twitch", "oauth">
Providers.Twitch({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"okta", "oauth"> & { domain: string; }
Providers.Okta({
  clientId: "foo123",
  clientSecret: "bar123",
  domain: "https://foo.auth0.com",
})

// $ExpectType Provider<"battlenet", "oauth"> & { region: string; }
Providers.BattleNet({
  clientId: "foo123",
  clientSecret: "bar123",
  region: "europe",
})

// $ExpectType Provider<"box", "oauth">
Providers.Box({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"cognito", "oauth"> & { domain: string; }
Providers.Cognito({
  clientId: "foo123",
  clientSecret: "bar123",
  domain: "https://foo.auth0.com",
})

// $ExpectType Provider<"yandex", "oauth">
Providers.Yandex({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"linkedin", "oauth">
Providers.LinkedIn({
  clientId: "foo123",
  clientSecret: "bar123",
  scope: "r_emailaddress r_liteprofile",
})

// $ExpectType Provider<"spotify", "oauth">
Providers.Spotify({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"spotify", "oauth">
Providers.Spotify({
  clientId: "foo123",
  clientSecret: "bar123",
  scope: "user-read-email",
})

// $ExpectType Provider<"basecamp", "oauth">
Providers.Basecamp({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"reddit", "oauth">
Providers.Reddit({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"azure-ad-b2c", "oauth">
Providers.AzureADB2C({
  clientId: "foo123",
  clientSecret: "bar123",
  scope: "offline_access User.Read",
  tenantId: "tenantId",
  idToken: true,
})

// $ExpectType Provider<"fusionauth", "oauth">
Providers.FusionAuth({
  name: "FusionAuth",
  domain: "domain",
  clientId: "clientId",
  clientSecret: "clientSecret",
  tenantId: "tenantId",
})

// $ExpectType Provider<"faceit", "oauth">
Providers.FACEIT({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"instagram", "oauth">
Providers.Instagram({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"kakao", "oauth">
Providers.Kakao({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"osso", "oauth">
Providers.Osso({
  clientId: "foo123",
  clientSecret: "bar123",
})

// $ExpectType Provider<"zoho", "oauth">
Providers.Zoho({
  clientId: "foo123",
  clientSecret: "bar123",
})
