---
id: email-provider
title: Email Provider
---

### How to

The Email provider uses email to send "magic links" that can be used sign in, you will likely have seen them before if you have used software like Slack.

Adding support for signing in via email in addition to one or more OAuth services provides a way for users to sign in if they lose access to their OAuth account (e.g. if it is locked or deleted).

Configuration is similar to other providers, but the options are different:

```js title="pages/api/auth/[...nextauth].js"
import Providers from `next-auth/providers`
...
providers: [
  Providers.Email({
    server: process.env.EMAIL_SERVER,
    from: process.env.EMAIL_FROM,
    // maxAge: 24 * 60 * 60, // How long email links are valid for (default 24h)
  }),
],
...
```

See the [Email provider documentation](/providers/email) for more information on how to configure email sign in.

:::note
The email provider requires a database, it cannot be used without one.
:::

### Options

|          Name           |                                     Description                                     |               Type               | Required |
| :---------------------: | :---------------------------------------------------------------------------------: | :------------------------------: | :------: |
|           id            |                             Unique ID for the provider                              |             `string`             |   Yes    |
|          name           |                          Descriptive name for the provider                          |             `string`             |   Yes    |
|          type           |                       Type of provider, in this case `email`                        |            `"email"`             |   Yes    |
|         server          |                     Path or object pointing to the email server                     |       `string` or `Object`       |   Yes    |
| sendVerificationRequest |               Callback to execute when a verification request is sent               | `(params) => Promise<undefined>` |   Yes    |
|          from           |   The email address from which emails are sent, default: "<no-reply@example.com>"   |             `string`             |    No    |
|         maxAge          | How long until the e-mail can be used to log the user in seconds. Defaults to 1 day |             `number`             |    No    |
