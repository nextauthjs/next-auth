---
id: line
title: LINE
---

## Documentation

https://developers.line.biz/en/docs/line-login/integrate-line-login/

## Configuration

https://developers.line.biz/console/

## Options

The **Line Provider** comes with a set of default options:

- [Line Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/line.ts)

You can override any of the options to suit your own use case.

## Example

```js
import LineProvider from "next-auth/providers/line";
...
providers: [
  LineProvider({
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

:::tip
To retrieve email address, you need to apply for Email address permission. Open [Line Developer Console](https://developers.line.biz/console/), go to your Login Channel. Scroll down bottom to find **OpenID Connect** -> **Email address permission**. Click **Apply** and follow the instruction.
:::
