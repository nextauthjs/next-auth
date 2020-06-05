---
id: basic-options
title: Basic Options
---
Configuration options are passed to NextAuth.js when initalizing in your API route.

The only *required* options are **site**, **providers** and **database**.

## Options

### site

* **Default value**: `empty string`
* **Required**: *Yes*

#### Description 

The fully qualified URL for the root of your site.

e.g. `http://localhost:3000` or `https://www.example.com`

---

### providers

* **Default value**: `[]`
* **Required**: *Yes*

#### Description 

An array of authentication providers for signing in (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order. This can be one of the built-in providers or an object with a custom provider.

See the [providers documentation](/options/providers) for a list of supported providers and how to use them.

---

### database

* **Default value**: `null`
* **Required**: *Yes*

#### Description 

A database connection string or [TypeORM](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) configuration object.

NextAuth.js has built in support for MySQL, MariaDB, Postgress, MongoDB and SQLite databases.

The default database provider is also compatible with other ANSI SQL compatible databases.

NextAuth.js can can be used with any database by specifying a custom `adapter` option.

---

### secret

* **Default value**: *SHA Hash of Options*
* **Required**: *No* (but strongly recommended)

#### Description

A random string used to hash tokens and sign cookies (e.g. SHA hash).

If not provided will be auto-generated based on hash of all your provided options.

The default behaviour is secure, but volatile, and it is strongly recommended you explicitly specify a value for your secret to avoid invalidating any tokens when the automatically generated hash changes.

---

### jwt

* **Default value**: `false`
* **Required**: *No*

#### Description 

If set to `true` will use client side JSON Web Token instead of the `session` table in the database.

The JWT is signed with `HMAC SHA256` and includes the user profile, the provider account they signed in with and the session expiry (which is also set on the cookie and on the JWT expiry property).

From a NextAuth.js perspective it works just like a database based session, but is faster and cheaper to run!

This option works great combined with serverless and a cloud database for persisting users accounts.

```
{
  nextauth: {
    user: {
      name: 'Iain Collins',
      email: 'me@iaincollins.com',
      image: 'https://example.com/image.jpg',
      id: 1
    },
    sessionExpires: '2020-07-03T02:18:55.574Z',
    accessToken: '540c2f7669e4e72a1b0a167cc81d34a488f9cf2018fd9f7e5fc0639fa0ee3241',
    account: {
      provider: 'google',
      type: 'oauth',
      id: 3218529,
      refreshToken: 'cc0d32d79145091cd6cd8979f0a6d6b67d490899',
      accessToken: '931400799b4a980715bb55af1bb8e01d92316956',
      accessTokenExpires: null
    },
    isNewUser: true
  },
  iat: 1591150735,
  exp: 4183150735
}
```

:::tip
Enable the debug option with **debug: true** to view contents of the decoded JWT on the console.
:::

:::note
The JWT is stored in the Session Token cookie – the same cookie used for database sessions.
:::

---

### jwtSecret

* **Default value**: *set to contents of `secret` by default*
* **Required**: *No* (but strongly recommended if using JWT)

#### Description 

A secret key used to sign JWT tokens. This should be specified if using JSON Web Tokens.

If not set defaults to the value of `secret` - which is auto-generated if not defined.

---

### sessionMaxAge

* **Default value**: `30*24*60*60*1000` (30 days)
* **Required**: *No*

#### Description

How long sessions can be idle before they expire and the user has to sign in again.

:::tip
If using JSON Web Tokens you may wish to set **sessionMaxAge** to a shorter value, as unlike a database session, the sessions cannot be 'expired' server side to force someone to be sign out.
:::

---

### sessionUpdateAge

* **Default value**: `24*60*60*1000` (24 hours)
* **Required**: *No*

#### Description

How frequently the session expiry should be updated in the database.

It effectively throttles database writes for sessions, which can improve performance and reduce costs.

It should always be less than `sessionMaxAge`. 

*For example:*

If `sessionMaxAge` specifies a session is valid for up to 30 days and `sessionUpdateAge` is set to 24 hours, and a session was last updated less than 24 hours ago, then the session expiry time on the active session would not be updated.

However, if a session that was active was last updated more than 24 hours ago, then the session expiry time *would* be updated in the session database.

:::tip
If you have a short session max age (e.g. < 24 hours) or if you want to be able to track what sessions have been active recently by querying the session database, you can set **sessionUpdateAge** to **0** to create a rolling session that always extends the session expiry any time a session is active.
:::

:::note
If using JSON Web Tokens **sessionUpdateAge** is ignored – they are always updated when accessed.
:::

---

### verificationMaxAge

* **Default value**: `24*60*60*1000` (24 hours)
* **Required**: *No*

#### Description

How long links in verification emails are valid for.

These are used for passwordless sign in via email.

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

See the documentation for the [pages option](/options/pages) for more information.

---

### debug

* **Default value**: `false`
* **Required**: *No*

#### Description

Set debug to `true` to enable debug messages for authenticaiton and database operations.
