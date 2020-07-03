---
id: options
title: Options
---

## Environment Variables

_Environment variable support was introduced in v3.0 to reduce the amount of configuration across client and server side rendered pages and API routes. Only the `NEXTAUTH_URL` environment variable is required._

### NEXTAUTH_URL

When deploying to production you need to set the `NEXTAUTH_URL` environment variable to the canonical URL of your site. This is required for sign in and to access sessions from API routes and server side functions.

#### Example

```
NEXTAUTH_URL=https://example.com
```

### NEXTAUTH_BASE_PATH

If you cannot use `/api/auth` for your API route you can optionally define a different path using `NEXTAUTH_BASE_PATH`.

#### Example

```
NEXTAUTH_BASE_PATH=/api/auth
```

---

## Options

Options are passed to NextAuth.js when initializing it in an API route.

### providers

* **Default value**: `[]`
* **Required**: *Yes*

#### Description 

An array of authentication providers for signing in (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order. This can be one of the built-in providers or an object with a custom provider.

See the [providers documentation](/configuration/providers) for a list of supported providers and how to use them.

---

### database

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

### secret

* **Default value**: `string` (*SHA hash of the "options" object*)
* **Required**: *No* (but strongly recommended)

#### Description

A random string used to hash tokens and sign cookies (e.g. SHA hash).

If not provided will be auto-generated based on hash of all your provided options.

The default behaviour is secure, but volatile, and it is strongly recommended you explicitly specify a value for secret to avoid invalidating any tokens when the automatically generated hash changes.

---

### session

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
}
```

---

### jwt

* **Default value**: `object`
* **Required**: *No*

#### Description

Using JSON Web Tokens to store session data is often faster, cheaper and more scaleable than using a database to store sessions.

You can use JSON Web Tokens for session data in conjuction with a database for user data, or you can use JSON Web Tokens without a database.

JSON Web Tokens are only used if JWT sessions are enabled with `session: { jwt: true }`, or if you have not specified a database (in which case they are enabled by default).

When enabled, JSON Web Tokens are signed with **HMAC SHA256** and then encrypted with symmetric **AES**.

Default values for the JWT option are shown below:

```js
jwt: {
  // secret: 'my-secret-123', // Secret auto-generated if not specified.
  
  // By default the JSON Web Token is signed with SHA256 and encrypted with AES.
  //
  // You can define your own encode/decode functions for signing + encryption if
  // you want to override the default behaviour (or to add/remove information
  // from the JWT when it is encoded).
  // encode: async ({ secret, key, token, maxAge }) => {},
  // decode: async ({ secret, key, token, maxAge }) => {},
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

You can use the built-in `getJwt()` helper method to verify and decrupt the token, like this:

```js
import jwt from 'next-auth/jwt'

const secret = process.env.JWT_SECRET

export default async (req, res) =>  {
  const token = await jwt.getJwt({ req, secret })
  console.log(JSON.stringify(token, null, 2))
  res.end()
}
```

:::note
The JWT is stored in the Session Token cookie – the same cookie used for database sessions.
:::

---

### pages

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

See the documentation for the [pages option](/configuration/pages) for more information.

---

### callbacks

* **Default value**: `object`
* **Required**: *No*

#### Description

Callbacks are asynchronous functions you can use to control what happens when an action is performed.

Callbacks are extremely powerful, especially in scenarios involving JSON Web Tokens as they allow you to implement access controls without a database and to integrate with external databases or APIs.

You can specify a handler for any of the callbacks below.

```js
callbacks: {
  signIn: async (profile, account, metadata) => { },
  redirect: async (url, baseUrl) => { },
  session: async (session, token) => { },
  jwt: async (token, profile) => => { }
}
```

See the [callbacks documentation](/configuration/callbacks) for more information on how to use the callback functions.

---

### events

* **Default value**: `object`
* **Required**: *No*

#### Description

Events are asynchronous functions that do not return a response, they are useful for audit logging.

You can specify a handler for any of these events below - e.g. for debugging or to create an audit log.

The content of the message object varies depending on the flow (e.g. OAuth or Email authentication flow, JWT or database sessions, etc), but typically contains a user object and/or contents of the JSON Web Token and other information relevent to the event.

```js
events: {
  signIn: async (message) => { /* on successful sign in */ },
  signOut: async (message) => { /* on signout */ },
  createUser: async (message) => { /* user created */ },
  linkAccount: async (message) => { /* account linked to a user */ },
  session: async (message) => { /* session is active */ },
  error: async (message) => { /* error in authentication flow */ }
}
```

---

### debug

* **Default value**: `false`
* **Required**: *No*

#### Description

Set debug to `true` to enable debug messages for authentication and database operations.

---

## Advanced Options

Advanced options are passed the same way as basic options, but may have complex implications or side effects. You should try to avoid using advanced options unless you are very comfortable using them.

---

### adapter

* **Default value**: *Adapter.Default()*
* **Required**: *No*

#### Description

A custom provider is an advanced option intended for use only you need to use NextAuth.js with a database configuration that is not supported by the default `database` adapter.

See the [adapter documentation](/schemas/adapters) for more information.

:::note
If the `adapter` option is specified it overrides the `database` option.
:::

---

### useSecureCookies

* **Default value**: `true` for HTTPS sites / `false` for HTTP sites
* **Required**: *No*

#### Description

When set to `true` (the default for all site URLs that start with `https://`) then all cookies set by NextAuth.js will only be accessible from HTTPS URLs.

This option defaults to `false` on URLs that start with `http://` (e.g. `http://localhost:3000`) for developer convenience.

You can manually set this option to `false` to disable this security feature and allow cookies to be accessible from non-secured URLs (this is not recommended).

:::note
Properties on any custom `cookies` that are specified override this option.
:::

:::warning
Setting this option to *false* in production is a security risk and may allow sessions to hijacked. Using this option is not recommended.
:::

---

### cookies

* **Default value**: `{}`
* **Required**: *No*

#### Description

You can override the default cookie names and options for any of the cookies used by NextAuth.js.

This is an advanced option and using it is not recommended as you may break authentication or introduce security flaws into your application.

You can specify one or more cookies with custom properties, but if you specify custom options for a cookie you must provided all the options for it. You will also likely want to create conditional behaviour to support local development (e.g. setting `secure: false` and not using cookie prefixes on localhost URLs).

**For example:**

```js
cookies: {
  sessionToken: {
    name: `__Secure-next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true
    }
  },
  callbackUrl: {
    name: `__Secure-next-auth.callback-url`,
    options: {
      sameSite: 'lax',
      path: '/',
      secure: true
    }
  },
  csrfToken: {
    name: `__Host-next-auth.csrf-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true
    }
  }
}
```

:::warning
Changing the cookie options may introduce security flaws into your application and may break NextAuth.js integration now or in a future update. Using this option is not recommended.
:::
