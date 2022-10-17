---
id: gitlab
title: GitLab
---

## Documentation

https://docs.gitlab.com/ee/api/oauth2.html

## Configuration

https://gitlab.com/-/profile/applications

The "redirect URIs" used when creating the credentials must include your full domain and end in the callback path. For example;

- For production: `https://{YOUR_DOMAIN}/api/auth/callback/gitlab`
- For development: `http://localhost:3000/api/auth/callback/gitlab`

:::tip
Gitlab allows multiple redirect URI's for the same application, one line per URI
:::

## Options

The **Gitlab Provider** comes with a set of default options:

- [Gitlab Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/gitlab.ts)

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
