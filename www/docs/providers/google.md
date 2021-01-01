---
id: google
title: Google
---

## Documentation

https://developers.google.com/identity/protocols/oauth2

## Configuration

https://console.developers.google.com/apis/credentials

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Google({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  })
]
...
```

:::warning
Google only provide the Refresh Token to an application the first time a user signs in.

To force Google to re-issue a Refresh Token, the user needs to remove the application from their account and sign in again:
https://myaccount.google.com/permissions

Alternatively, you can also pass options in the `authorizationUrl` which will force the Refresh Token to always be provided on sign in, however this will ask all users to confirm if they wish to grant your application access every time they sign in.

If you need access to the RefreshToken or AccessToken for a Google account and you are not using a database to persist user accounts, this may be something you need to do.

```js
const options = {
  ...
  providers: [
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
      authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth?prompt=consent&access_type=offline&response_type=code',
    })
  ],
  ...
}
```
:::

:::tip
Google also return an `verified_email` boolean property in the OAuth profile.

You can use this property to restrict access to people with verified accounts at a particular domain.

```js
const options = {
  ...
  callbacks: {
    signIn: async (user, account, profile) => {
      if (account.provider === 'google' &&
          profile.verified_email === true &&
          profile.email.endsWith('@example.com')) {
        return true
      } else {
        return false
      }
    },
  }
  ...
}
```
:::
