---
id: options
title: NextAuth.js Options
---

Options are passed to NextAuth.js when initalizing it in an API route.

:::note
The only *required* options are **site** and **providers**.
:::

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
  
  // Easily add custom properties to response from `/api/auth/session`.
  //
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

### jwt

* **Default value**: `object`
* **Required**: *No*

#### Description

JSON Web Tokens are only used if JWT sessions are enabled with `session: { jwt: true }` (see `session` documentation).

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
  //
  // Note: 'oAuthProfile' is the raw oAuth profile from the provider the user
  // used to sign in with and is only returned when the JWT is created for the 
  // current user / session, if you want to persist data from it you need to add
  // the data you want to keep to the token. Keep in mind JWT token size limits.
  /*
  set: async (token, oAuthProfile) => { 
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
  // Automatically decrypts and verifies JWT
  const token = await jwt.getJwt({ req, secret })
  res.end(JSON.stringify(token, null, 2))
}
```

:::note
The JWT is stored in the Session Token cookie – the same cookie used for database sessions.
:::

---

### allowSignin

* **Default value**: `function` (returns `boolean`)
* **Required**: *No*

#### Description

The `allowSignin` option allows you to define a function that determines if a user / account can sign in.

The function is passed a user and account object associated with the the provider the client has used.

If the function returns `true` the user can sign in, if it returns `false` an access denied message is displayed.

This works with all providers (OAuth and Email) and both with and without databases.

It is useful to control access to dashboards/admin pages without requiring a user database.

Example:

```js
// `user` and `account` correspond the data persisted in the database, they are
// still present even if not using a database but may contain more limited data.
//
// `oAuthProfile` is the raw oAuth profile from the provider the user used to
// sign in with; is only present when signing with OAuth.
allowSignin: async (user, account, oAuthProfile) => {
  // Return true if user / account is allowed to sign in.
  // Return false to display an access denied message.
  return true
}
```

:::warning
You should not rely on the email address alone unless that provider is trusted and has supplied a verified email address. e.g. The built-in Google provider is configured to only return verified email addresses.
:::

---

### allowCallbackUrl

* **Default value**: `function` (returns URL as `string`)
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

---

## Advanced Options


:::warning
Advanced options are passed the same way as basic options, but may have complex implications or side effects. You should try to avoid using advanced options unless you are very comfortable using them.
:::

---

### basePath

* **Default value**: `/api/auth`
* **Required**: *No*

#### Description

This option allows you to specify a different base path if you don't want to use `/api/auth` for some reason.

If you set this option you **must** also specify the same value in the `NEXTAUTH_BASE_PATH` environment variable in `next.config.js` so that the client knows how to contact the server:

```js
module.exports = {
  env: {
    NEXTAUTH_BASE_PATH: '/api/my-custom-auth-route',
  },
}
```

This is required because the NextAuth.js API route is a seperate codepath to the NextAuth.js Client.

As long as you also specify this option in an environment variable, the client will be able to pick up any subsequent configuration from the server, but if you do not set in both it the NextAuth.js Client will not work.

---

### adapter

* **Default value**: *Adapater.Default()*
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

You can manually set this option to `false` to disable this security feature and allow cookies to be acessible from non-secured URLs (this is not recommended).

:::note
Properties on any custom `cookies` that are specified override this option.
:::

:::warning
Setting this option to *false* in production is a security risk and may allow sessions to hijacked.
:::

---

### cookies

* **Default value**: `{}`
* **Required**: *No*

#### Description

You can override the default cookie names and options for any of the cookies used by NextAuth.js.

This is an advanced option and using it is not recommended as you may break authentication or introduce security flaws into your application.

You can specify one or more cookies with custom properties, but if you specify custom options for a cookie you must provided all the options for it. You will also likely want to create condtional behaviour to support local development (e.g. setting `secure: false` and not using cookie prefixes on localhost URLs).

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
  baseUrl: {
    name: `__Secure-next-auth.base-url`,
    options: {
      httpOnly: true,
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