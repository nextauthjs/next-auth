---
id: callbacks
title: Callbacks
---

Callbacks are asynchronous functions you can use to control what happens when an action is performed.

Callbacks are extremely powerful, especially in scenarios involving JSON Web Tokens as they allow you to implement access controls without a database and to integrate with external databases or APIs.

You can specify a handler for any of the callbacks below.

#### How to use the callback option

```js
callbacks: {
  signin: async (profile, account, metadata) => { },
  redirect: async (url, baseUrl) => { },
  session: async (session, token) => { },
  jwt: async (token) => { }
}
```

The documentation below shows how to implement each callback and their default behaviour.

## Signin

Use the signin callback to control if a user is allowed to sign in or not.

This is triggered before sign in flow completes, so the user profile may be a
user object (with an ID) or it may be just their name and email address,
depending on the sign in flow and if they have an account already.

When using email sign in, this method is triggered both when the user requests
to sign in and again when they activate the link in the sign in email.

```js
/**
 * @param  {object} profile  User profile (e.g. user id, name, email)
 * @param  {object} account  Account used to sign in (e.g. OAuth account)
 * @param  {object} metadata Provider specific metadata (e.g. OAuth Profile)
 * @return {boolean|object}  Return `true` (or a modified JWT) to allow sign in
 *                           Return `false` to deny access
 */
const signin = async (profile, account, metadata) => {
  const isAllowedToSignIn = true
  if (isAllowedToSignIn) {
    return Promise.resolve(true)
  } else {
    return Promise.resolve(false)
  }
}
```

## Redirect

The redirect callback is called anytime the user is redirected to a callback URL
(e.g. on signin or signout).

By default, for security, only Callback URLs on the same URL as the site are
allowed, you can use the redirect callback to customise that behaviour.

```js
/**
 * @param  {string} url      URL provided as callback URL by the client
 * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
 * @return {string}          URL the client will be redirect to
 */
const redirect = async (url, baseUrl) => {
  return url.startsWith(baseUrl)
    ? Promise.resolve(url)
    : Promise.resolve(baseUrl)
}
```

## Session

The session callback is called whenever a session is checked.

e.g. `getSession()`, `useSession()`, `/api/auth/session` (etc)

If JSON Web Tokens are enabled, you can also access the decrypted token and use
this method to pass information from the encoded token back to the client.

The JWT callback is invoked before session is called, so anything you add to the
JWT will be immediately available in the session callback.

```js
/**

 * @param  {object} session  Session object
 * @param  {object} token    JSON Web Token (if enabled)
 * @return {object}          Session that will be returned to the client 
 */
const session = async (session, token) => {
  return Promise.resolve(session)
}
```

## JWT

This JSON Web Token callback is called whenever a JSON Web Token is created or updated.

e.g. `/api/auth/signin`, `getSession()`, `useSession()`, `/api/auth/session` (etc)

On initial sign in with an OAuth provider, the raw oAuthProfile returned by the
provider is also passed as a parameter - it is not available on subsequent calls.

You can take advantage of this to persist additional data you need from their
raw profile to the encoded JWT.

```js
/**
 * @param  {object} token         Decrypted JSON Web Token
 * @param  {object} oAuthProfile  OAuth profile - only available on sign in
 * @return {object}               JSON Web Token that will be saved
 */
const jwt = async (token, oAuthProfile) => {
  return Promise.resolve(token)
}

export default {
  signin,
  redirect,
  session,
  jwt
}

```