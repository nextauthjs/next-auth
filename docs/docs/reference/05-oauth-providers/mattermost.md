---
id: mattermost
title: Mattermost
---

## Documentation

https://developers.mattermost.com/integrate/apps/authentication/oauth2/

## Configuration

http://localhost:8065/finn/integrations/oauth2-apps

## Options

The **Mattermost provider** comes with a set of default options:

- [Mattermost Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/mattermost.ts)

You can override any of the options to suit your own use case.

## Example

```ts
import mattermostProvider from "next-auth/providers/mattermost";
...
providers: [
  mattermostProvider({
    // The base url of your Mattermost instance. e.g https://my-cool-server.cloud.mattermost.com
    mattermostUrl: env.MM_URL,
    clientId: env.MM_CLIENT_ID,
    clientSecret: env.MM_CLIENT_SECRET,
  })
]
...
```
