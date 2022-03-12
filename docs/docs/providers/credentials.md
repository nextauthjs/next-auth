---
id: credentials
title: Credentials
---

## Overview

The Credentials provider allows you to handle signing in with arbitrary credentials, such as a username and password, domain, or two factor authentication or hardware device (e.g. YubiKey U2F / FIDO).

It is intended to support use cases where you have an existing system you need to authenticate users against.

It comes with the constraint that users authenticated in this manner are not persisted in the database, and consequently that the Credentials provider can only be used if JSON Web Tokens are enabled for sessions.

:::warning
The functionality provided for credentials based authentication is intentionally limited to discourage use of passwords due to the inherent security risks associated with them and the additional complexity associated with supporting usernames and passwords.
:::

## Options

The **Credentials Provider** comes with a set of default options:

- [Credentials Provider options](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/providers/credentials.ts)

You can override any of the options to suit your own use case.

## Example

The Credentials provider is specified like other providers, except that you need to define a handler for `authorize()` that accepts credentials submitted via HTTP POST as input and returns either:

1. A `user` object, which indicates the credentials are valid.

If you return an object it will be persisted to the JSON Web Token and the user will be signed in, unless a custom `signIn()` callback is configured that subsequently rejects it.

2. If you return `null` then an error will be displayed advising the user to check their details.

3. If you throw an Error, the user will be sent to the error page with the error message as a query parameter.

The Credentials provider's `authorize()` method also provides the request object as the second parameter (see example below).

```js title="pages/api/auth/[...nextauth].js"
import CredentialsProvider from "next-auth/providers/credentials";
...
providers: [
  CredentialsProvider({
    // The name to display on the sign in form (e.g. "Sign in with...")
    name: "Credentials",
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: {  label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
      // Add logic here to look up the user from the credentials supplied
      const user = { id: 1, name: "J Smith", email: "jsmith@example.com" }

      if (user) {
        // Any object returned will be saved in `user` property of the JWT
        return user
      } else {
        // If you return null then an error will be displayed advising the user to check their details.
        return null

        // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
      }
    }
  })
]
...
```

See the [callbacks documentation](/configuration/callbacks) for more information on how to interact with the token.

## Multiple providers

### Example code

You can specify more than one credentials provider by specifying a unique `id` for each one.

You can also use them in conjunction with other provider options.

As with all providers, the order you specify them is the order they are displayed on the sign in page.

```js
providers: [
  CredentialsProvider({
    id: "domain-login",
    name: "Domain Account",
    async authorize(credentials, req) {
      const user = {
        /* add function to get user */
      }
      return user
    },
    credentials: {
      domain: {
        label: "Domain",
        type: "text ",
        placeholder: "CORPNET",
        value: "CORPNET",
      },
      username: { label: "Username", type: "text ", placeholder: "jsmith" },
      password: { label: "Password", type: "password" },
    },
  }),
  CredentialsProvider({
    id: "intranet-credentials",
    name: "Two Factor Auth",
    async authorize(credentials, req) {
      const user = {
        /* add function to get user */
      }
      return user
    },
    credentials: {
      email: { label: "Username", type: "text ", placeholder: "jsmith" },
      "2fa-key": { label: "2FA Key" },
    },
  }),
  /* ... additional providers ... /*/
]
```

![](/img/signin-complex.png)
