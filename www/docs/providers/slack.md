---
id: slack
title: Slack
---

## API Documentation

https://api.slack.com

## App Configuration

https://api.slack.com/apps

## Usage

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