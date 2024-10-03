---
id: workos
title: WorkOS
---

## Documentation

https://workos.com/docs/sso/guide

## Configuration

https://dashboard.workos.com

## Options

The **WorkOS Provider** comes with a set of default options:

- [WorkOS Provider options](https://github.com/nextauthjs/next-auth/blob/v4/packages/next-auth/src/providers/workos.ts)

You can override any of the options to suit your own use case.

## Example

```js
import WorkOSProvider from "next-auth/providers/workos";
...
providers: [
  WorkOSProvider({
    clientId: process.env.WORKOS_CLIENT_ID,
    clientSecret: process.env.WORKOS_API_KEY,
  }),
],
...
```

WorkOS is not an identity provider itself, but, rather, a bridge to multiple single sign-on (SSO) providers. As a result, we need to make some additional changes to authenticate users using WorkOS.

In order to sign a user in using WorkOS, we need to specify which WorkOS Connection to use. You should use the `organization` or `connection` `authorizationParams` to specify which connection to use:

```js
import { signIn } from "next-auth/react"


const organization = 'ORGANIZATION_ID';
signIn(provider.id, undefined, {
  organization,
});
```

This can be done using a custom login page. See [Create a Next.js application with WorkOS SSO and NextAuth.js](https://workos.com/docs/integrations/next-auth/6-creating-a-custom-login-page).
