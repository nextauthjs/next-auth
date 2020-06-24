---
id: slack
title: Slack
---

## Documentation

https://api.slack.com

## Configuration

https://api.slack.com/apps

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Slack({
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET
  })
}
...