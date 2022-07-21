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

- [Reddit Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/reddit.js)

You can override any of the options to suit your own use case.

## Example

```js
import RedditProvider from "next-auth/providers/reddit";
...
providers: [
  RedditProvider({
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
This Provider template only has a one hour access token to it and only has the "identity" scope. If you want to get a refresh token as well you must follow this:

```js
providers: [
  {
    id: 'reddit',
      name: 'Reddit',
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET,
      authorization: {
        url: 'https://www.reddit.com/api/v1/authorize?response_type=code&duration=permanent',
        params: { scope: 'identity mysubreddits read' },
      },
      type: 'oauth',
      version: '2.0',
      token: {
        url: 'https://www.reddit.com/api/v1/access_token',
        params: { grant_type: 'authorization_code' },
      },
      userinfo: 'https://oauth.reddit.com/api/v1/me',
      profile: profile => {
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
