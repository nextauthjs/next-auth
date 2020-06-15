---
id: credentials
title: Credentials
---

## Overview

The Credentials provider allows you to handle signing in with arbitrary credentials, such as a username and password, two factor authentication or hardware device (e.g. YubiKey U2F / FIDO).

It is intended to support use cases where you have an existing system you need to authenticate users against.

It comes with the constraint that users authenticated in this manner are not persisted in the database, and that the Credentials provider can only be used if JSON Web Tokens are enabled for sessions.

:::note
The functionality provided for credentials based authentication is intentionally limited to discourage use of username and password based authenticaiton due to the inherent security risks associated with using usernames and passwords, and the complexities associated with supporting them.
:::

## Usage

The Credentials provider is specified like other providers, except that you need to define a handler for `authorize()` that accepts credentials input and returns either a `user` object or `false`.

If you return an object it will be persisted to the JSON Web Token and the user will be signed in.

If you return `false` then Access Denied will be displayed.

```js title="/pages/api/auth/[...nextauth].js"
import Providers from `next-auth/providers`
...
providers: [
  Providers.Credentials({
    authorize: async (credentials) => {
      const user = getUserFromCredentials(credentials) // You need to add this!
      if (user) {
        return Promise.resolve(user)
      } else {
        return Promise.resolve(false)
      }
    }
  })
}
...
```

To use your new credentials provider, you will need to create a form that posts back to `/api/auth/callback/credentials`.

All form parameters submitted will be passed as `credentials` to your `authorize` callback.

```js title="/pages/signin"
import React from 'react'

export default () => {
  return (
    <form method='post' action='/api/auth/callback/credentials'>
      <input name='email' type='text' defaultValue='' />
      <input name='password' type='password' defaultValue='' />
      <button type='submit'>Sign in</button>
    </form>
  )
}
```

As the JSON Web Token is encrypted, you can safely store user credentials in it and revalidate them whenever an action is performed. See the [callbacks documentation](/configuration/callbacks) for more information on how to interact with the token.