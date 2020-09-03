---
id: twitter
title: Twitter
---

## Documentation

https://developer.twitter.com

## Configuration

https://developer.twitter.com/en/apps

## Example

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
You must enable the *"Request email address from users"* option in your app permissions if you want to obtain the users email address.
:::

![twitter](https://user-images.githubusercontent.com/7902980/83944068-1640ca80-a801-11ea-959c-0e744e2144f7.PNG)