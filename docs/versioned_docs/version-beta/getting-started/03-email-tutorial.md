---
title: Email authentication
---

### How to

The Email provider sends "magic links" via email that the user can click on to sign in.
You have likely seen them before if you have used software like Slack.

Adding support for signing in via email in addition to one or more OAuth services provides a way for users to sign in if they lose access to their OAuth account (e.g. if it is locked or deleted).

Configuration is similar to other providers, but the options are different:

```js title="pages/api/auth/[...nextauth].js"
import EmailProvider from `next-auth/providers/email`
...
providers: [
  EmailProvider({
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