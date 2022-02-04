---
id: slack
title: Slack
---

## Documentation

https://api.slack.com/authentication
https://api.slack.com/docs/sign-in-with-slack

## Configuration

https://api.slack.com/apps

## Options

The **Slack Provider** comes with a set of default options:

- [Slack Provider options](https://github.com/nextauthjs/next-auth/blob/ead715219a5d7a6e882a6ba27fa56b03954d062d/src/providers/slack.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Slack({
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET
  })
]
...
```
