---
id: gitlab
title: GitLab
---

:::note
GitLab returns a field on `Account` called `created_at` which is a number. See their [docs](https://docs.gitlab.com/ee/api/oauth2.html). Remember to add this field as optional to your database schema, in case if you are using an [Adapter](https://authjs.dev/reference/adapters).
:::

## Documentation

https://docs.gitlab.com/ee/api/oauth2.html

## Configuration

https://gitlab.com/-/profile/applications

## Options

The **Gitlab Provider** comes with a set of default options:

- [Gitlab Provider options](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/providers/gitlab.ts)

You can override any of the options to suit your own use case.

## Example

```js
import GitlabProvider from "next-auth/providers/gitlab";
...
providers: [
  GitlabProvider({
    clientId: process.env.GITLAB_CLIENT_ID,
    clientSecret: process.env.GITLAB_CLIENT_SECRET
  })
]
...
```

:::tip
Enable the _"read_user"_ option in scope if you want to save the users email address on sign up.
:::
