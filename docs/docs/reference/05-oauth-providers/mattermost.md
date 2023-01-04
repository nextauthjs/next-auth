---
id: mattermost
title: Mattermost
---

## Documentation

https://developers.mattermost.com/integrate/apps/authentication/oauth2

## Configuration

http://my-cool-server.cloud.mattermost.com/mycoolteam/integrations/oauth2-apps

## Options

The **Mattermost provider** comes with a set of default options:

- [Mattermost Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/mattermost.ts)

You can override any of the options to suit your own use case.

## Example

```ts
import MattermostProvider from "next-auth/providers/mattermost";
...
providers: [
  MattermostProvider({
    // The base url of your Mattermost instance. e.g https://my-cool-server.cloud.mattermost.com
    mattermostUrl: env.MATTERMOST_URL,
    clientId: env.MATTERMOST_CLIENT_ID,
    clientSecret: env.MATTERMOST_CLIENT_SECRET,
  })
]
...
```
