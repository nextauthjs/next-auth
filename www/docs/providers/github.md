---
id: github
title: GitHub
---

## API Documentation

https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps

## App Configuration

https://github.com/settings/apps

## Usage

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Github({
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET
  })
}
...

:::warning
Only allows one callback URL. May not return email address if privacy enabled. 
:::