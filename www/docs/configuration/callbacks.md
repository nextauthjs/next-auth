---
id: callbacks
title: Callbacks
---

Callbacks are asynchronous functions you can use to control what happens when an action is performed.

Callbacks are extremely powerful, especially in scenarios involving JSON Web Tokens as they allow you to implement access controls without a database and to integrate with external databases or APIs.

### Example

You can specify a handler for any of the callbacks below.

```js title="pages/api/auth/[...nextauth.js]"
callbacks: {
  signIn: async (profile, account, metadata) => { },
  redirect: async (url, baseUrl) => { },
  session: async (session, token) => { },
  jwt: async (token, profile, isNewUser) => { }
}
```

The documentation below shows how to implement each callback and their default behaviour.

## Sign In

Use the signin callback to control if a user is allowed to sign in or not.

This is triggered before sign in flow completes, so the user profile may be a user object (with an ID) or it may be just their name and email address, depending on the sign in flow and if they have an account already.

When using email sign in, this method is triggered both when the user requests to sign in and again when they activate the link in the sign in email.

```js title="pages/api/auth/[...nextauth.js]"
callbacks: {
  /**
   * @param  {object} profile  User profile (e.g. user id, name, email)
   * @param  {object} account  Account used to sign in (e.g. OAuth account)
   * @param  {object} metadata Provider specific metadata (e.g. OAuth Profile)
   * @return {boolean|object}  Return `true` (or a modified JWT) to allow sign in
   *                           Return `false` to deny access
   */
  signIn: async (profile, account, metadata) => {
    const isAllowedToSignIn = true
    if (isAllowedToSignIn) {
      return Promise.resolve(true)
    } else {
      return Promise.resolve(false)
    }
  }
}
```

## Redirect

The redirect callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout).

By default, for security, only Callback URLs on the same URL as the site are allowed, you can use the redirect callback to customise that behaviour.

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

## Session

The session callback is called whenever a session is checked.

e.g. `getSession()`, `useSession()`, `/api/auth/session` (etc)

If JSON Web Tokens are enabled, you can also access the decrypted token and use this method to pass information from the encoded token back to the client.

The JWT callback is invoked before the session() callback is called, so anything you add to the
JWT will be immediately available in the session callback.

```js title="pages/api/auth/[...nextauth.js]"
callbacks: {
  /**
   * @param  {object} session  Session object
   * @param  {object} token    JSON Web Token (if enabled)
   * @return {object}          Session that will be returned to the client 
   */
  session: async (session, token) => {
    return Promise.resolve(session)
  }
}
```

## JWT

This JSON Web Token callback is called whenever a JSON Web Token is created (i.e. at sign 
in) or updated (i.e whenever a session is accesed in the client).

e.g. `/api/auth/signin`, `getSession()`, `useSession()`, `/api/auth/session` (etc)

* The JWT expiry time is updated / extended whenever a session is accessed.

* On sign in, the raw profile for a user returned by the provider is also passed as a parameter.

The raw profile is not available after the initial callback that is triggered when the user signs in. You can take advantage of it beomg present on the first callback, to persist any additional data you need from the users profile in the JWT (and from there, expose it in the session, using the session callback).

```js title="pages/api/auth/[...nextauth.js]"
callbacks: {
  /**
   * @param  {object}  token     Decrypted JSON Web Token
   * @param  {object}  profile   Profile is (only available on sign in)
   * @param  {boolean} isNewUser Is new user (only available on sign in and when using JWT with a database)
   * @return {object}            JSON Web Token that will be saved
   */
  jwt: async (token, profile, isNewUser) => {
    return Promise.resolve(token)
  }
}
```
