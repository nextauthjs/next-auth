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
Only allows one callback URL per Client ID + Secret. May not return email address if privacy enabled. 
:::