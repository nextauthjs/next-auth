---
id: reddit
title: Reddit
---

## Documentation

https://www.reddit.com/dev/api/

## Configuration

https://www.reddit.com/prefs/apps/

## Options

The **Reddit Provider** comes with a set of default options:

- [Reddit Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/reddit.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Reddit({
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET
  })
]
...
```

:::warning
Reddit requires authorization every time you go through their page.
:::

:::warning
Only allows one callback URL per Client ID / Client Secret.
:::

:::tip
This Provider template only has a one hour access token to it and only has the 'identity' scope. If you want to get a refresh token as well you must follow this:

```js
providers: [
  {
    id: "reddit",
    name: "Reddit",
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    scope: "identity mysubreddits read", //Check Reddit API Documentation for more. The identity scope is required.
    type: "oauth",
    version: "2.0",
    params: { grant_type: "authorization_code" },
    accessTokenUrl: " https://www.reddit.com/api/v1/access_token",
    authorizationUrl:
      "https://www.reddit.com/api/v1/authorize?response_type=code&duration=permanent",
    profileUrl: "https://oauth.reddit.com/api/v1/me",
    profile: (profile) => {
      return {
        id: profile.id,
        name: profile.name,
        email: null,
      }
    },
  },
]
```

:::
