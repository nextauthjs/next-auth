---
id: providers
title: Authentication Providers
---

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

NextAuth.js is designed to work with any OAuth service, it supports OAuth 1.0, 1.0A and 2.0 and has built-in support for many popular OAuth sign-in services. It also supports email / passwordless authentication.

## Sign in with OAuth

### Built-in providers

* [Apple](/providers/apple)
* [Auth0](/providers/auth0)
* [Discord](/providers/discord)
* [Facebook](/providers/facebook)
* [Github](/providers/github)
* [Google](/providers/google)
* [Mixer](/providers/Mixer)
* [Okta](/providers/Okta)
* [Slack](/providers/slack)
* [Twitch](/providers/Twitch)
* [Twitter](/providers/twitter)

:::warning
NextAuth.js requires an email address to sign in. If an account does not have an email address, a user will be asked to sign in with an account that does. 
:::

### Using a built-in provider

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

  ```js title="/pages/api/auth/[...nextauth].js"
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

```json
{
  id: 'google',
  name: 'Google',
  type: 'oauth',
  version: '2.0',
  scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
  params: { grant_type: 'authorization_code' },
  accessTokenUrl: 'https://accounts.google.com/o/oauth2/token',
  requestTokenUrl: 'https://accounts.google.com/o/oauth2/auth',
  authorizationUrl: 'https://accounts.google.com/o/oauth2/auth?response_type=code',
  profileUrl: 'https://www.googleapis.com/oauth2/v1/userinfo?alt=json',
  profile: (profile) => {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      image: profile.picture
    }
  },
  clientId: '',
  clientSecret: ''
}
```
You can replace all the options in this JSON object with the ones from your custom provider – be sure to give it a unique ID and specify the correct OAuth version - and add it to the providers option:

```js title="/pages/api/auth/[...nextauth].js"
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

#### Options

|       Name       |                     Description                     | Required |
| :--------------: | :-------------------------------------------------: | :------: |
|        id        |        An unique ID for your custom provider        |   Yes    |
|       name       |       An unique name for your custom provider       |   Yes    |
|       type       | Type of provider, in this case it should be `oauth` |   Yes    |
|     version      |                   OAuth version.                    |   Yes    |
|      scope       |                 OAuth access scopes                 |    No    |
|      params      |       Additional authorization URL parameters       |    No    |
|  accessTokenUrl  |        Endpoint to retrieve an access token         |   Yes    |
| requestTokenUrl  |        Endpoint to retrieve a request token         |    No    |
| authorizationUrl |   Endpoint to request authorization from the user   |   Yes    |
|    profileUrl    |       Endpoint to retrieve the user's profile       |    No    |
|     profile      |           An object with the user's info            |    No    |
|     clientId     |           Client ID of the OAuth provider           |   Yes    |
|   clientSecret   |         Client Secret of the OAuth provider         |    No    |
|      idToken     |  Set to `true` for services that use ID Tokens (e.g. OpenID)     |    No    |

:::note
Feel free to open a PR for your custom configuration if you've created one for a provider that others may be interested in so we can add it to the list of built-in OAuth providers!
:::

## Sign in with Email

```js title="/pages/api/auth/[...nextauth].js"
providers: [
  Providers.Email({
    server: {
      host: process.env.EMAIL_SERVER_HOST,
      port: process.env.EMAIL_SERVER_PORT,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD
      }
    },
    from: process.env.EMAIL_FROM
  }),
],
```

See the [Email Provider documentation](/providers/email) for more information on how to configure email sign in.
