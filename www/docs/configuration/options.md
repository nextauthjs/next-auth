---
id: options
title: Options
---

## Environment Variables

### NEXTAUTH_URL 

When deploying to production, set the `NEXTAUTH_URL` environment variable to the canonical URL of your site.

```
NEXTAUTH_URL=https://example.com
```

If your Next.js application uses a custom base path, specify the route to the API endpoint in full.

_e.g. `NEXTAUTH_URL=https://example.com/custom-route/api/auth`_

:::tip
To set environment variables on Vercel, you can use the [dashboard](https://vercel.com/dashboard) or the `now env` command.
:::

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
* **Required**: *No (unless using email provider)*

#### Description 

A database connection string or [TypeORM](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) configuration object.

NextAuth.js has built in support for MySQL, MariaDB, Postgress, MongoDB and SQLite databases.

The default database provider is also compatible with other ANSI SQL compatible databases.

NextAuth.js can can be used with any database by specifying a custom `adapter` option.

:::tip
The Email provider requires a database to be configured to store single use sign in tokens.
:::

---

### secret

* **Default value**: `string` (*SHA hash of the "options" object*)
* **Required**: *No - but strongly recommended!*

#### Description

A random string used to hash tokens, sign cookies and generate crytographic keys.

If not specified is uses a hash of all configuration options, including Client ID / Secrets for entropy.

The default behaviour is volatile, and it is strongly recommended you explicitly specify a value to avoid invalidating end user sessions when configuration changes are deployed.

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

JSON Web Tokens are can be used for session tokens if enabled with `session: { jwt: true }` option. JSON Web Tokens enabled by default if you have not specified a database.

By default JSON Web Tokens tokens are signed (JWS) but not encrypted (JWE), as JWT encryption adds additional overhead and comes with some caveats. You can enable encryption by setting `encryption: true`.

#### JSON Web Token Options

```js
jwt: {
  // A secret to use for key generation - you should set this explicitly
  // Defaults to NextAuth.js secret if not explicitly specified.
  // secret: 'INp8IvdIyeMcoGAgFGoA61DdBglwwSqnXJZkgz8PSnw',
  
  // Set to true to use encryption. Defaults to false (signing only).
  // encryption: true,

  // You can define your own encode/decode functions for signing and encryption
  // if you want to override the default behaviour.
  // encode: async ({ secret, token, maxAge }) => {},
  // decode: async ({ secret, token, maxAge }) => {},
}
```

An example JSON Web Token contains a payload like this:

```js
{
  name: 'Iain Collins',
  email: 'me@iaincollins.com',
  picture: 'https://example.com/image.jpg',
  "iat": 1594601838,
  "exp": 1597193838
}
```

#### JWT Helper

You can use the built-in `getToken()` helper method to verify and decrypt the token, like this:

```js
import jwt from 'next-auth/jwt'

const secret = process.env.JWT_SECRET

export default async (req, res) => {
  const token = await jwt.getToken({ req, secret })
  console.log('JSON Web Token', token)
  res.end()
}
```

_For convenience, this helper function is also able to read and decode tokens passed in an HTTP Bearer header._

**Required**

The getToken() helper requires the following options:

* `req` - (object) Request object
* `secret` - (string) JWT Secret

You must also pass *any options configured on the `jwt` option* to the helper.

e.g. Including custom session `maxAge` and custom signing and/or encryption keys or options

**Optional**

It also supports the following options:

* `secureCookie` - (boolean) Use secure prefixed cookie name

  By default, the helper function will attempt to determine if it should use the secure prefixed cookie (e.g. `true` in production and `false` in development, unless NEXTAUTH_URL contains an HTTPS URL).

* `cookieName` - (string) Session token cookie name

  The `secureCookie` option is ignored if `cookieName` is explcitly specified.

:::note
The JWT is stored in the Session Token cookie, the same cookie used for tokens with database sessions.
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

### adapter

* **Default value**: *Adapater.Default()*
* **Required**: *No*

#### Description

By default NextAuth.js uses a database adapter that uses TypeORM and supports MySQL, MariaDB, Postgres and MongoDB and SQLite databases. An alternative adapter that uses Prisma, which currently supports MySQL, MariaDB and Postgres, is also included.

You can use the `adapter` option to use the Prisma adapter - or pass in your own adapter if you want to use a database that is not supported by one of the built-in adapters.

See the [adapter documentation](/schemas/adapters) for more information.

:::note
If the `adapter` option is specified it overrides the `database` option, only specify one or the other.
:::

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
Setting this option to *false* in production is a security risk and may allow sessions to hijacked if used in production. It is intended to support development and testing. Using this option is not recommended.
:::

---

### cookies

* **Default value**: `{}`
* **Required**: *No*

#### Description

You can override the default cookie names and options for any of the cookies used by NextAuth.js.

This is an advanced option and using it is not recommended as you may break authentication or introduce security flaws into your application.

You can specify one or more cookies with custom properties, but if you specify custom options for a cookie you must provided all the options for that cookie.

If you use this feature, you will likely want to create conditional behaviour to support setting different cookies policies in development and production builds, as you will be opting out of the built-in dynamic policy.

:::tip
An example of a use case for this option is to support sharing session tokens across subdomains.
:::

#### Example

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
Using a custom cookie policy may introduce security flaws into your application and is intended as an option for advanced users who understand the implications. Using this option is not recommended.
:::
