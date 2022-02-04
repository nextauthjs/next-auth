---
id: slack
title: Slack
---

## Documentation

https://api.slack.com/authentication
https://api.slack.com/docs/sign-in-with-slack

## Configuration

https://api.slack.com/apps

:::warning
Slack requires you that the redirect URL of your app uses `https`, even for local development. An easy workaround for this is using a service like [`ngrok`](https://ngrok.com) that creates a secure tunnel to your app, using `https`. Remember to set the url as `NEXTAUTH_URL` as well.
:::

![](https://i.imgur.com/ydYKTLD.png)

## Options

The **Slack Provider** comes with a set of default options:

- [Slack Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/slack.ts)

You can override any of the options to suit your own use case.

## Example

```js
import SlackProvider from "next-auth/providers/slack";
...
providers: [
  SlackProvider({
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET
  })
]
...
```
