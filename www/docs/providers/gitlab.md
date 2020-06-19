---
id: gitlab
title: Gitlab
---

## API Documentation

https://docs.gitlab.com/ee/api/oauth2.html

## App Configuration

https://gitlab.com/profile/applications

## Usage

```js
import Providers from `next-auth/providers`
...
providers: [
  Providers.Gitlab({
    clientId: process.env.GITLAB_CLIENT_ID,
    clientSecret: process.env.GITLAB_CLIENT_SECRET
  })
}
...
```
:::tip
Enable the *"read_user"* option in scope if you want to save the users email address on sign up.
:::