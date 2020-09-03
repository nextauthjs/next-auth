---
id: github
title: GitHub
---

## Documentation

https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps

## Configuration

https://github.com/settings/apps

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.GitHub({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  })
}
...
```

:::warning
Only allows one callback URL per Client ID / Client Secret.
:::

:::tip
Email address is not returned if privacy settings are enabled. 
:::