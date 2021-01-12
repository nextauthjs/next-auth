---
id: reddit
title: Reddit
---

## Documentation

https://www.reddit.com/dev/api/

## Configuration

https://www.reddit.com/prefs/apps/

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Reddit({
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET
  })
}
...
```

:::warning
Reddit requires authorization every time you go through their page.
:::

:::warning
Only allows one callback URL per Client ID / Client Secret.
:::

:::tip
You can expand the scope by passing the scope variable. The identity scope is required. 
:::
