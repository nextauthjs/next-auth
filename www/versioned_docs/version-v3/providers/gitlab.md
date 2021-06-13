---
id: gitlab
title: GitLab
---

## Documentation

https://docs.gitlab.com/ee/api/oauth2.html

## Configuration

https://gitlab.com/profile/applications

## Options

The **Gitlab Provider** comes with a set of default options:

- [Gitlab Provider options](https://github.com/nextauthjs/next-auth/blob/main/src/providers/gitlab.js)

You can override any of the options to suit your own use case.

## Example

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.GitLab({
    clientId: process.env.GITLAB_CLIENT_ID,
    clientSecret: process.env.GITLAB_CLIENT_SECRET
  })
]
...
```

:::tip
Enable the _"read_user"_ option in scope if you want to save the users email address on sign up.
:::
