---
id: instagram
title: Instagram
---

## Documentation

https://developers.facebook.com/docs/instagram-basic-display-api/getting-started

## Configuration

https://developers.facebook.com/apps/

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Instagram({
    clientId: process.env.INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.INSTAGRAM_CLIENT_SECRET
  })
}
...
```

:::warning
Email address is not returned by the Instagram API.
:::

:::tip
Instagram display app required callback url to be configured in your Facebook app and Facebook required you to use **https** even for localhost ! In order to that, you either need to [add a ssl to your localhost](https://www.freecodecamp.org/news/how-to-get-https-working-on-your-local-development-environment-in-5-minutes-7af615770eec/) or use a proxy such as [ngrock](https://ngrok.com/docs).
:::

