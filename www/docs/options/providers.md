---
id: providers
title: Providers
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

NextAuth.js is designed to work with any 0Auth service, it supports 0Auth 1.0, 1.0A and 2.0 and has built-in support for many popular 0Auth sign-in services. It also supports email / passwordless authentication.

## Sign in with OAuth

### Built-in providers

| Name | Documentation | Configuration | Notes
| --- | --- | --- | --- |
| `Auth0`    | [Documentation](https://auth0.com/docs/api/authentication#authorize-application) | [Configuration](https://manage.auth0.com/dashboard) | Requires accessTokenUrl, authorizationUrl, profileUrl.
| `Apple`    | -- | -- |
| `Discord`  | [Documentation](https://discord.com/developers/docs/topics/oauth2) | [Configuration](https://discord.com/developers/applications) | Doesn't need clientSecret.
| `Facebook` | [Documentation](https://developers.facebook.com/docs/facebook-login/manually-build-a-login-flow/) | [Configuration](https://developers.facebook.com/apps/) | Doesn't allow testing production applications with localhost URLs. May not return email address if the account was created with a mobile number.
| `Github`   | [Documentation](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/) | [Configuration](https://github.com/settings/apps/) | Only allows one callback URL. May not return email address if privacy enabled.
| `Google`   | [Documentation](https://developers.google.com/identity/protocols/oauth2) | [Configuration](https://console.developers.google.com/apis/credentials) |
| `Mixer`    | [Documentation](https://dev.mixer.com/reference/oauth) | [Configuration](https://mixer.com/lab/oauth) |
| `Slack`    | [Documentation](https://api.slack.com) |[Configuration]( https://api.slack.com/apps) |
| `Twitch`   | [Documentation](https://dev.twitch.tv/docs/authentication) | [Configuration](https://dev.twitch.tv/console/apps) |
| `Twitter`  | [Documentation](https://developer.twitter.com) | [Configuration](https://developer.twitter.com/en/apps) | Must enable the *"Request email address from users"* option in your app permissions.

:::tip
Most OAuth providers only need a **Client ID** and a **Client Secret** to work but some need some additional options and there are gotchas with some providers (see table above).
:::

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

<Image src="https://user-images.githubusercontent.com/595695/82076867-5915f380-96d6-11ea-8975-2059ce1c81a7.png" alt="Login Screenshot" />

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
    scope: []  // Make sure to request the users email address
    ...
  }
]
...
```

:::note
Feel free to open a PR for your custom configuration if you've created one for a provider that others may be interested in so we can add it to the list of built-in OAuth providers!
:::

## Sign in with Email

*The email provider can be used in conjuction with – or instead of – one or more OAuth providers.*

1. You will need an SMTP account; ideally for one of the [services known to work with nodemailer](http://nodemailer.com/smtp/well-known/).
2. There are two ways to configure the SMTP server connection.

  You can either use a connection string or a nodemailer configuration object.

  2.1 **Using a connection string**

  Create an .env file to the root of your project and the connection string and email address.
  ```js title=".env" {1}
	EMAIL_SERVER=smtp://username:password@smtp.example.com:587
	EMAIL_FROM=noreply@example.com
  ```

  Now you can add the email provider like this:

  ```js {3} title="/pages/api/auth/[...nextauth].js"
  providers: [
    Providers.Email({
      server: process.env.EMAIL_SERVER, 
      from: process.env.EMAIL_FROM
    }),
  ],
  ```

  2.2 **Using a configuration object**

  In your `.env` file in the root of your project simply add the configuration object options individually:

  ```js title=".env"
  EMAIL_SERVER_USER=username
  EMAIL_SERVER_PASSWORD=password
  EMAIL_SERVER_HOST=smtp.example.com
	EMAIL_SERVER_PORT=587
	EMAIL_FROM=noreply@example.com
  ```
  Now you can add the provider settings to the NextAuth options object in the Email Provider.

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
3. You can now sign in with an email address at `/api/auth/signin`.

  An account will not be created for the user until the first time they verify their email address. If an email address already assoicated with an account, the user will be signed in to that account when they use the link in the email.

:::note
You can fully customise the email that is sent. How to do this is not yet documented.
:::

:::tip
If you create a custom sign in form for email sign in, you will need to submit both fields for the **email** address and **csrfToken** from **/api/auth/csrf** in a POST request to **/api/auth/signin/email**.
:::
