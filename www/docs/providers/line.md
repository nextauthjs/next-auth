---
id: line
title: LINE
---

## Documentation

https://developers.line.biz/en/docs/line-login/integrate-line-login/

## Configuration

https://developers.line.biz/console/

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.LINE({
    clientId: process.env.LINE_CLIENT_ID,
    clientSecret: process.env.LINE_CLIENT_SECRET
  })
]
...
```

## Instructions

### Configuration

Create a provider and a LINE login channel at `https://developers.line.biz/console/`. In the settings of the channel under LINE Login, activate web app and configure the following:

- Callback URL
  - http://localhost:3000/api/auth/callback/line