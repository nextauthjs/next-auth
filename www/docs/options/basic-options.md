---
id: basic-options
title: Basic Options
---

:::note
* Configuration options are passed to NextAuth.js when initalizing it in an API route.
* The only *required* options are **site** and **providers**.
:::

---

## site

* **Default value**: `empty string`
* **Required**: *Yes*

#### Description 

The fully qualified URL for the root of your site.

e.g. `http://localhost:3000` or `https://www.example.com`

---

## providers

* **Default value**: `[]`
* **Required**: *Yes*

#### Description 

An array of authentication providers for signing in (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order. This can be one of the built-in providers or an object with a custom provider.

See the [providers documentation](/options/providers) for a list of supported providers and how to use them.

---

## database

* **Default value**: `null`
* **Required**: *No* (Except by Email provider)

#### Description 

A database connection string or [TypeORM](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) configuration object.

NextAuth.js has built in support for MySQL, MariaDB, Postgress, MongoDB and SQLite databases.

The default database provider is also compatible with other ANSI SQL compatible databases.

NextAuth.js can can be used with any database by specifying a custom `adapter` option.

:::tip
The Email provider currently requires a database to be configured.
:::

---

## secret

* **Default value**: `string` (*SHA hash of the "options" object*)
* **Required**: *No* (but strongly recommended)

#### Description

A random string used to hash tokens and sign cookies (e.g. SHA hash).

If not provided will be auto-generated based on hash of all your provided options.

The default behaviour is secure, but volatile, and it is strongly recommended you explicitly specify a value for secret to avoid invalidating any tokens when the automatically generated hash changes.

---

## session

* **Default value**: `object`
* **Required**: *No*

#### Description

The `session` object and all properties on it are optional.

Default values for this option are shown below:

```js
session: {
  // Use JSON Web Tokens for session instead of database sessions.
  // This option can be used with or without a database for users/accounts.
  // Note: `jwt` is automatically set to `true` if no database is specified.
  jwt: false, 
  
  // Seconds - How long until an idle session expires and is no longer valid.
  maxAge: 30 * 24 * 60 * 60, // 30 days
  
  // Seconds - Throttle how frequently to write to database to extend a session.
  // Use it to limit write operations. Set to 0 to always update the database.
  // Note: This option is ignored if using JSON Web Tokens 
  updateAge: 24 * 60 * 60, // 24 hours
  
  // Easily add custom properties to response from `/api/auth/session`.
  // Note: The response should not return any sensitive information. The JWT
  // option is supplied if JWT enabled and contains a (decrypted) copy of the
  // JWT payload for instances where you need to use data from it to populate
  // the response returned to the client.
  /*
  get: async (session, jwt) => {
    session.customSessionProperty = "ABC123"
    return session
  }
  */
}
```

---

## jwt

* **Default value**: `object`
* **Required**: *No*

#### Description

The `jwt` object and all properties on it are optional.

When enabled, JSON Web Tokens is signed with `HMAC SHA256` and encrypted with symmetric `AES`.

Using JWT to store sessions is often faster, cheaper and more scaleable relying on a database.

Default values for this option are shown below:

```js
jwt: {
  // secret: 'my-secret-123', // Secret auto-generated if not specified.
    
  // Custom encode/decode functions for signing + encryption can be specified.
  // if you want to override what is in the JWT or how it is signed.
  // encode: async ({ secret, key, token, maxAge }) => {},
  // decode: async ({ secret, key, token, maxAge }) => {},

  // Easily add custom to the JWT. It is updated every time it is accessed.
  // This encrypted and signed by default and may contain sensitive information
  // as long as a reasonable secret is defined.
  /*
  set: async (token) => { 
    token.customJwtProperty = "ABC123"
    return token
  }
  */
}
```

An example JSON WebToken contains an encrypted payload like this:

```js
{
  user: {
    name: 'Iain Collins',
    email: 'me@iaincollins.com',
    image: 'https://example.com/image.jpg',
    id: 1 // User ID will note be specified if used without a database
  },
  // The account object stores details for the authentication provider account 
  // that was used to sign in. It only contains exactly one account, even the 
  // user is linked to multiple provider accounts in a database.
  account: {
    provider: 'google',
    type: 'oauth',
    id: 3218529,
    refreshToken: 'cc0d32d79145091cd6cd8979f0a6d6b67d490899',
    accessToken: '931400799b4a980715bb55af1bb8e01d92316956',
    accessTokenExpires: null
  },
  isNewUser: true, // Is set to true if is first sign in
  iat: 1591150735, // Issued at
  exp: 4183150735  // Expires in
}
```

You can use the built-in `getJwt()` helper method to read the token, like this:

```js
import jwt from 'next-auth/jwt'

const secret = process.env.JWT_SECRET

export default async (req, res) =>  {
  const token = await jwt.getJwt({ req, secret })
  res.end(JSON.stringify(token, null, 2))
}
```

:::note
The JWT is stored in the Session Token cookie – the same cookie used for database sessions.
:::

---

## allowSignin

* **Default value**: `function`
* **Required**: *No*

#### Description

The `allowSignin` option allows you to define a function that determines if a user / account can sign in.

The function is passed a user and account object associated with the the provider the client has used.

If the function returns `true` the user can sign in, if it returns `false` an access denied message is displayed.

This works with all providers (OAuth and Email) and both with and without databases.

It is useful to control access to dashboards/admin pages without requiring a user database.

Example:

```js
allowSignin: async (user, account) => {
  // Return true if user / account is allowed to sign in.
  // Return false to display an access denied message.
  return true
}
```

:::warning
You should not rely on the email address alone unless that provider is trusted and has supplied a verified email address. e.g. The built-in Google provider is configured to only return verified email addresses.
:::

---

## allowCallbackUrl

* **Default value**: `function`
* **Required**: *No*

#### Description

By default `allowCallbackUrl` only allows callbackUrls for signup and signout to be at the same site as the one being signed into.

e.g. if the sign in URL was `https://example.com/api/auth/signin` the following logic would apply:

* ✅ `https://example.com/path/to/page`
* ❌ `http://example.com/path/to/page` 
* ❌ `https://subdomain.example.com/path/to/page` 
* ❌ `https://example.com:8080/path/to/page`

If the URL is not allowed, the callback URL will be set to whatever the `site` option is set to.

The default function looks like this:

```js
allowCallbackUrl: async (url, site) => {
  if (url.startsWith(site)) {
    return Promise.resolve(url)
  } else {
    return Promise.resolve(site)
  }
}
```

If you want to support signing in to sites across other domains or hostnames you can pass your own function to `allowCallbackUrl` to customise the behaviour.

---

## pages

* **Default value**: `{}`
* **Required**: *No*

#### Description

Specify URLs to be used if you want to create custom sign in, sign out and error pages.

Pages specified will override the corresponding built-in page.

*For example:*

```js
pages: {
  signin: '/auth/signin',
  signout: '/auth/signout',
  error: '/auth/error', // Error code passed in query string as ?error=
  verifyRequest: '/auth/verify-request', // (used for check email message)
  newUser: null // If set, new users will be directed here on first sign in
}
```

See the documentation for the [pages option](/options/pages) for more information.

---

## debug

* **Default value**: `false`
* **Required**: *No*

#### Description

Set debug to `true` to enable debug messages for authenticaiton and database operations.
