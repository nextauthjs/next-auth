---
id: twitter
title: Twitter
---

## API Documentation

https://developer.twitter.com

## App Configuration

https://developer.twitter.com/en/apps

## Usage

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Twitter({
    clientId: process.env.TWITTER_CLIENT_ID,
    clientSecret: process.env.TWITTER_CLIENT_SECRET
  })
}
...
```

:::tip
Enable the *"Request email address from users"* option in your app permissions if you want to save the users email address on sign up.
:::

![twitter](https://user-images.githubusercontent.com/7902980/83944068-1640ca80-a801-11ea-959c-0e744e2144f7.PNG)