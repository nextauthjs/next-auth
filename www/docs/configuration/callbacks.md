---
id: callbacks
title: Callbacks
---

Callbacks are asynchronous functions you can use to control what happens when an action is performed.

Callbacks are extremely powerful, especially in scenarios involving JSON Web Tokens as they allow you to implement access controls without a database and to integrate with external databases or APIs.

:::tip
If you want to pass data such as an Access Token or User ID to the browser when using JSON Web Tokens, you can persist the data in the token when the `jwt` callback is called, then pass the data through to the browser in the `session` callback.
:::

You can specify a handler for any of the callbacks below.

```js title="pages/api/auth/[...nextauth].js"
...
  callbacks: {
    signIn: async (user, account, profile) => {
      return Promise.resolve(true)
    },
    redirect: async (url, baseUrl) => {
      return Promise.resolve(baseUrl)
    },
    session: async (session, user) => {
      return Promise.resolve(session)
    },
    jwt: async (token, user, account, profile, isNewUser) => {
      return Promise.resolve(token)
    }
...
}
```

The documentation below shows how to implement each callback, their default behaviour and an example of what the response for each callback should be.

## Sign in callback

Use the `signIn()` callback to control if a user is allowed to sign in. When using email sign in, this method is triggered both when the user requests to sign in and again when they activate the link in the sign in email.

```js title="pages/api/auth/[...nextauth.js]"
callbacks: {å
  /**
   * @param  {object} user     User object
   * @param  {object} account  Provider account
   * @param  {object} profile  Provider profile 
   * @return {boolean}         Return `true` (or a modified JWT) to allow sign in
   *                           Return `false` to deny access
   */
  signIn: async (user, account, profile) => {
    const isAllowedToSignIn = true
    if (isAllowedToSignIn) {
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  }
}
```

:::note
When using NextAuth.js with a database, the User object will either be a full user object (including the User ID) for users that have signed in before, or a prototype user object (just name, email, image) for users who have not signed in before.

When using NextAuth.js without a database, the user object it will always be a prototype user object.
:::

## Redirect callback

The redirect callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout).

By default only URLs on the same URL as the site are allowed, you can use the redirect callback to customise that behaviour.

```js title="pages/api/auth/[...nextauth.js]"
callbacks: {
  /**
   * @param  {string} url      URL provided as callback URL by the client
   * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
   * @return {string}          URL the client will be redirect to
   */
  redirect: async (url, baseUrl) => {
    return url.startsWith(baseUrl)
      ? Promise.resolve(url)
      : Promise.resolve(baseUrl)
  }
}
```


:::note
The redirect callback may be invoked more than once in the same flow.
:::

## Session callback

The session callback is called whenever a session is checked.

e.g. `getSession()`, `useSession()`, `/api/auth/session`

* When using database sessions, the User object is passed as an argument.
* When using JSON Web Tokens for sessions, the JWT payload is provided instead.

```js title="pages/api/auth/[...nextauth.js]"
callbacks: {
  /**
   * @param  {object} session      Session object
   * @param  {object} user         User object    (if using database sessions)
   *                               JSON Web Token (if not using database sessions)
   * @return {object}              Session that will be returned to the client 
   */
  session: async (session, user, sessionToken) => {
    session.foo = 'bar' // Add property to session
    return Promise.resolve(session)
  }
}
```

:::tip
When using JSON Web Tokens the `jwt()` callback is invoked before the `session()` callback, so anything you add to the
JSON Web Token will be immediately available in the session callback.
:::

:::warning
The session object is not persisted server side, even when using database sessions - only data such as the session token, the user, and the expiry time is stored in the session table.

If you need to persist session data server side, you can use the `accessToken` returned for the session as a key - and connect to the database in the `session()` callback to access it. Session `accessToken` values do not rotate and are valid as long as the session is valid.

If using JSON Web Tokens instead of database sessions, you should use the User ID or a unique key stored in the token (you will need to generate a key for this yourself on sign in, as access tokens for sessions are not generated when using JSON Web Tokens).
:::

## JWT callback

This JSON Web Token callback is called whenever a JSON Web Token is created (i.e. at sign 
in) or updated (i.e whenever a session is accesed in the client).

e.g. `/api/auth/signin`, `getSession()`, `useSession()`, `/api/auth/session`

* As with database session expiry times, token expiry time is extended whenever a session is active.
* The arguments *user*, *account*, *profile* and *isNewUser* are only passed the first time this callback is called on a new session, after the user signs in.

The contents *user*, *account*, *profile* and *isNewUser* will vary depending on the provider and on if you are using a database or not. If you want to pass data such as User ID, OAuth Access Token, etc. to the browser, you can persist it in the token and use the `session()` callback to return it.

```js title="pages/api/auth/[...nextauth.js]"
callbacks: {
  /**
   * @param  {object}  token     Decrypted JSON Web Token
   * @param  {object}  user      User object      (only available on sign in)
   * @param  {object}  account   Provider account (only available on sign in)
   * @param  {object}  profile   Provider profile (only available on sign in)
   * @param  {boolean} isNewUser True if new user (only available on sign in)
   * @return {object}            JSON Web Token that will be saved
   */
  jwt: async (token, user, account, profile, isNewUser) => {
    const isSignIn = (user) ? true : false
    // Add auth_time to token on signin in
    if (isSignIn) { token.auth_time = new Date().toISOString() }
    return Promise.resolve(token)
  }
}
```

:::warning
NextAuth.js does not limit how much data you can store in a JSON Web Token, however a ~**4096 byte limit** for all cookies on a domain commonly imposed by browsers.

If you need to persist a large amount of data, you will need to persist it elsewhere (e.g. in a database). You can store a key that can be used to look up that data in the `session()` callback.
:::
