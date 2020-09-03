---
id: credentials
title: Credentials
---

## Overview

The Credentials provider allows you to handle signing in with arbitrary credentials, such as a username and password, domain, or two factor authentication or hardware device (e.g. YubiKey U2F / FIDO).

It is intended to support use cases where you have an existing system you need to authenticate users against.

It comes with the constraint that users authenticated in this manner are not persisted in the database, and consequently that the Credentials provider can only be used if JSON Web Tokens are enabled for sessions.

:::note
The functionality provided for credentials based authentication is intentionally limited to discourage use of passwords due to the inherent security risks associated with them and the additional complexity associated with supporting usernames and passwords.
:::

## Example

The Credentials provider is specified like other providers, except that you need to define a handler for `authorize()` that accepts credentials submitted via HTTP POST as input and returns either:

1. A `user` object, which indicates the credentials are valid.

  If you return an object it will be persisted to the JSON Web Token and the user will be signed in, unless a custom `signIn()` callback is configured that subsequently rejects it.

2. Either `false` or `null`, which indicates failure.

  If you return `false` or `null` then an error will be displayed advising the user to check their details.

3. `Promise.Rejected()` with an Error or a URL.

  If you reject the promise with an Error, the user will be sent to the error page with the error message as a query parameter. If you reject the promise with a URL (a string), the user will be redirected to the URL.

```js title="pages/api/auth/[...nextauth].js"
import Providers from `next-auth/providers`
...
providers: [
  Providers.Credentials({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    credentials: {
      username: { label: "Username", type: "text", placeholder: "jsmith" },
      password: {  label: "Password", type: "password" }
    },
    authorize: async (credentials) => {
      // Add logic here to look up the user from the credentials supplied
      const user = { id: 1, name: 'J Smith', email: 'jsmith@example.com' }

      if (user) {
        // Any object returned will be saved in `user` property of the JWT
        return Promise.resolve(user)
      } else {
        // If you return null or false then the credentials will be rejected
        return Promise.resolve(null)
        // You can also Reject this callback with an Error or with a URL:
        // return Promise.reject(new Error('error message')) // Redirect to error page
        // return Promise.reject('/path/to/redirect')        // Redirect to a URL
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

You can also use them in conjuction with other provider options.

As with all providers, the order you specify them is the order they are displayed on the sign in page.

```js
  providers: [
    Providers.Credentials({
      id: 'domain-login',
      name: "Domain Account",
      authorize: async (credentials) => {
        const user = { /* add function to get user */ }
        return Promise.resolve(user)
      },
      credentials: {
        domain: { label: "Domain", type: "text ", placeholder: "CORPNET", value: "CORPNET" },
        username: { label: "Username", type: "text ", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
     }
    }),
    Providers.Credentials({
      id: 'intranet-credentials',
      name: "Two Factor Auth",
      authorize: async (credentials) => {
        const user = { /* add function to get user */ } 
        return Promise.resolve(user)
      },
      credentials: {
        email: { label: "Username", type: "text ", placeholder: "jsmith" },
        "2fa-key": {  label: "2FA Key" }
     },
    }),
    /* ... additional providers ... /*/
  ]
```

### Example UI

This example below shows a complex configuration is rendered by the built in sign in page.

You can also [use a custom sign in page](/configuration/pages#credentials-sign-in) if you want to provide a custom user experience.

<Image src="/img/signin-complex.png"/>

export const Image = ({ children, src, alt = '' }) => ( 
  <div
    style={{
      padding: '0.2rem',
      width: '100%',
      display: 'flex',
      justifyContent: 'center'
    }}>
    <img alt={alt} src={src} />
  </div>
 )
