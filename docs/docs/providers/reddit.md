---
id: reddit
title: Reddit
---

## Documentation

https://www.reddit.com/dev/api/

## App Configuration

1. Visit https://www.reddit.com/prefs/apps/ and create a new web app
2. Provide a name for your web app
3. Provide a redirect uri ending with `/api/auth/callback/reddit`:

![next-auth-reddit-provider-config](https://user-images.githubusercontent.com/200280/185804449-88f8d0f2-35fa-4eb5-8ecc-5e0a6c813954.png)

4. All other fields are optional
5. Click the "create app" button

## Options

The **Reddit Provider** comes with a set of default options:

- [Reddit Provider options](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/providers/reddit.js)

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
  RedditProvider({
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    authorization: {
      params: {
        duration: "permanent",
      },
    },
  }),
]
```

:::
