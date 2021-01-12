---
id: providers
title: Providers
---

Authentication Providers in NextAuth.js are services that can be used to sign in (OAuth, Email, etc).

## Sign in with OAuth

NextAuth.js is designed to work with any OAuth service, it supports OAuth 1.0, 1.0A and 2.0 and has built-in support for many popular OAuth sign-in services.

### Built-in OAuth providers

* [Apple](/providers/apple)
* [Atlassian](/providers/atlassian)
* [Auth0](/providers/auth0)
* [Azure Active Directory B2C](/providers/azure-ad-b2c)
* [Basecamp](/providers/basecamp)
* [Battle.net](/providers/battle.net)
* [Box](/providers/box)
* [Bungie](/providers/bungie)
* [Amazon Cognito](/providers/cognito)
* [Discord](/providers/discord)
* [Facebook](/providers/facebook)
* [Foursquare](/providers/foursquare)
* [FusionAuth](/providers/fusionauth)
* [GitHub](/providers/github)
* [GitLab](/providers/gitlab)
* [Google](/providers/google)
* [IdentityServer4](/providers/identity-server4)
* [LINE](/providers/line)
* [LinkedIn](/providers/linkedin)
* [Mail.ru](/providers/mailru)
* [Mixer](/providers/mixer)
* [Netlify](/providers/netlify)
* [Okta](/providers/okta)
* [Reddit](/providers/reddit)
* [Slack](/providers/slack)
* [Spotify](/providers/spotify)
* [Strava](/providers/strava)
* [Twitch](/providers/Twitch)
* [Twitter](/providers/twitter)
* [VK](/providers/vk)
* [Yandex](/providers/yandex)

### Using a built-in OAuth provider

1. Register your application at the developer portal of your provider. There are links above to the developer docs for most supported providers with details on how to register your application.

2. The redirect URI should follow this format:
  ```
  [origin]/api/auth/callback/[provider]
  ```
  For example, Twitter on `localhost` this would be:
  ```
  http://localhost:3000/api/auth/callback/twitter
  ```
3. Create a `.env` file at the root of your project and add the client ID and client secret. For Twitter this would be:

  ```
  TWITTER_ID=YOUR_TWITTER_CLIENT_ID
  TWITTER_SECRET=YOUR_TWITTER_CLIENT_SECRET
  ```

4. Now you can add the provider settings to the NextAuth options object. You can add as many OAuth providers as you like, as you can see `providers` is an array.

  ```js title="pages/api/auth/[...nextauth].js"
  import Providers from `next-auth/providers`
  ...
  providers: [
    Providers.Twitter({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET
    })
  ],
  ...
  ```
5. Once a provider has been setup, you can sign in at the following URL: `[origin]/api/auth/signin`. This is an unbranded auto-generated page with all the configured providers.   

<Image src="/img/signin.png" alt="Signin Screenshot" />

:::tip
If you want to create a custom sign in link you can link to **/api/auth/signin/[provider]** which will sign in the user in directly with that provider.
:::

### Using a custom provider

You can use an OAuth provider that isn't built-in by using a custom object.

As an example of what this looks like, this is the the provider object returned for the Google provider:

```js
{
  id: "google",
  name: "Google",
  type: "oauth",
  version: "2.0",
  scope: "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  params: { grant_type: "authorization_code" },
  accessTokenUrl: "https://accounts.google.com/o/oauth2/token",
  requestTokenUrl: "https://accounts.google.com/o/oauth2/auth",
  authorizationUrl: "https://accounts.google.com/o/oauth2/auth?response_type=code",
  profileUrl: "https://www.googleapis.com/oauth2/v1/userinfo?alt=json",
  async profile(profile) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.picture
    }
  },
  clientId: "",
  clientSecret: ""
}
```
You can replace all the options in this JSON object with the ones from your custom provider - be sure to give it a unique ID and specify the correct OAuth version - and add it to the providers option:

```js title="pages/api/auth/[...nextauth].js"
import Providers from `next-auth/providers`
...
providers: [
  Providers.Twitter({
    clientId: process.env.TWITTER_ID,
    clientSecret: process.env.TWITTER_SECRET,
  }),
  {
    id: 'customProvider',
    name: 'CustomProvider',
    type: 'oauth',
    version: '2.0',
    scope: ''  // Make sure to request the users email address
    ...
  }
]
...
```

### OAuth provider options

|        Name         |                         Description                         |              Type               | Required |
| :-----------------: | :---------------------------------------------------------: | :-----------------------------: | :------: |
|         id          |                 Unique ID for the provider                  |            `string`             |   Yes    |
|        name         |              Descriptive name for the provider              |            `string`             |   Yes    |
|        type         |     Type of provider, in this case it should be `oauth`     | `oauth`, `email`, `credentials` |   Yes    |
|       version       |          OAuth version (e.g. '1.0', '1.0a', '2.0')          |            `string`             |   Yes    |
|   accessTokenUrl    |            Endpoint to retrieve an access token             |            `string`             |   Yes    |
|  authorizationUrl   |       Endpoint to request authorization from the user       |            `string`             |   Yes    |
|      clientId       |               Client ID of the OAuth provider               |            `string`             |   Yes    |
|    clientSecret     |             Client Secret of the OAuth provider             |            `string`             |    No    |
|        scope        |        OAuth access scopes (expects array or string)        |     `string` or `string[]`      |    No    |
|       params        |           Additional authorization URL parameters           |            `object`             |    No    |
|   requestTokenUrl   |            Endpoint to retrieve a request token             |            `string`             |    No    |
| authorizationParams | Additional params to be sent to the authorization endpoint  |            `object`             |    No    |
|     profileUrl      |           Endpoint to retrieve the user's profile           |            `string`             |    No    |
|       profile       |    An callback returning an object with the user's info     |            `object`             |    No    |
|       idToken       | Set to `true` for services that use ID Tokens (e.g. OpenID) |            `boolean`            |    No    |
|       headers       |    Any headers that should be sent to the OAuth provider    |            `object`             |    No    |

## Sign in with Email

The Email provider uses email to send "magic links" that can be used sign in, you will likely have seen them before if you have used software like Slack.

Adding support for signing in via email in addition to one or more OAuth services provides a way for users to sign in if they lose access to their OAuth account (e.g. if it is locked or deleted).

Configuration is similar to other providers, but the options are different:

```js title="pages/api/auth/[...nextauth].js"
import Providers from `next-auth/providers`
...
providers: [
  Providers.Email({
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
    // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
  }),
],
...
```

See the [Email provider documentation](/providers/email) for more information on how to configure email sign in.

:::note
The email provider requires a database, it cannot be used without one.
:::


## Sign in with Credentials

The Credentials provider allows you to handle signing in with arbitrary credentials, such as a username and password, two factor authentication or hardware device (e.g. YubiKey U2F / FIDO).

It is intended to support use cases where you have an existing system you need to authenticate users against.

```js title="pages/api/auth/[...nextauth].js"
import Providers from `next-auth/providers`
...
providers: [
  Providers.Credentials({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: {  label: "Password", type: "password" }
    },
   async authorize(credentials) {
      const user = (credentials) => {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        return null
      }
      if (user) {
        // Any user object returned here will be saved in the JSON Web Token
        return user
      } else {
        return null
      }
    }
  })
}
...
```

See the [Credentials provider documentation](/providers/credentials) for more information.

:::note
The Credentials provider can only be used if JSON Web Tokens are enabled for sessions. Users authenticated with the Credentials provider are not persisted in the database.
:::

<!-- React Image Component -->
export const Image = ({ children, src, alt = '' }) => (
  <div
    style={{
      padding: '0.2rem',
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    }}>
    <img alt={alt} src={src} />
  </div>
 )
