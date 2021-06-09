---
id: callbacks
title: Callbacks
---

Callbacks are **asynchronous** functions you can use to control what happens when an action is performed.

Callbacks are extremely powerful, especially in scenarios involving JSON Web Tokens as they allow you to implement access controls without a database and to integrate with external databases or APIs.

:::tip
If you want to pass data such as an Access Token or User ID to the browser when using JSON Web Tokens, you can persist the data in the token when the `jwt` callback is called, then pass the data through to the browser in the `session` callback.
:::

You can specify a handler for any of the callbacks below.

```js title="pages/api/auth/[...nextauth].js"
...
  callbacks: {
    async signIn(user, account, profile) {
      return true
    },
    async redirect(url, baseUrl) {
      return baseUrl
    },
    async session(session, user) {
      return session
    },
    async jwt(token, user, account, profile, isNewUser) {
      return token
    }
...
}
```

The documentation below shows how to implement each callback, their default behaviour and an example of what the response for each callback should be. Note that configuration options and authentication providers you are using can impact the values passed to the callbacks.

## Sign in callback

Use the `signIn()` callback to control if a user is allowed to sign in.

```js title="pages/api/auth/[...nextauth].js"
...
callbacks: {
  /**
   * @param  {object} user     User object
   * @param  {object} account  Provider account
   * @param  {object} profile  Provider profile
   * @return {boolean|string}  Return `true` to allow sign in
   *                           Return `false` to deny access
   *                           Return `string` to redirect to (eg.: "/unauthorized")
   */
  async signIn(user, account, profile) {
    const isAllowedToSignIn = true
    if (isAllowedToSignIn) {
      return true
    } else {
      // Return false to display a default error message
      return false
      // Or you can return a URL to redirect to:
      // return '/unauthorized'
    }
  }
}
...
```

- When using the **Email Provider** the `signIn()` callback is triggered both when the user makes a **Verification Request** (before they are sent email with a link that will allow them to sign in) and again _after_ they activate the link in the sign in email.

  Email accounts do not have profiles in the same way OAuth accounts do. On the first call during email sign in the `profile` object will include a property `verificationRequest: true` to indicate it is being triggered in the verification request flow. When the callback is invoked _after_ a user has clicked on a sign in link, this property will not be present.

  You can check for the `verificationRequest` property to avoid sending emails to addresses or domains on a blocklist (or to only explicitly generate them for email address in an allow list).

- When using the **Credentials Provider** the `user` object is the response returned from the `authorization` callback and the `profile` object is the raw body of the `HTTP POST` submission.

:::note
When using NextAuth.js with a database, the User object will be either a user object from the database (including the User ID) if the user has signed in before or a simpler prototype user object (i.e. name, email, image) for users who have not signed in before.

When using NextAuth.js without a database, the user object it will always be a prototype user object, with information extracted from the profile.
:::

## Redirect callback

The redirect callback is called anytime the user is redirected to a callback URL (e.g. on signin or signout).

By default only URLs on the same URL as the site are allowed, you can use the redirect callback to customise that behaviour.

```js title="pages/api/auth/[...nextauth].js"
...
callbacks: {
  /**
   * @param  {string} url      URL provided as callback URL by the client
   * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
   * @return {string}          URL the client will be redirect to
   */
  async redirect(url, baseUrl) {
    return url.startsWith(baseUrl)
      ? url
      : baseUrl
  }
}
...
```

:::note
The redirect callback may be invoked more than once in the same flow.
:::

## JWT callback

This JSON Web Token callback is called whenever a JSON Web Token is created (i.e. at sign
in) or updated (i.e whenever a session is accessed in the client).

e.g. `/api/auth/signin`, `getSession()`, `useSession()`, `/api/auth/session`

- As with database session expiry times, token expiry time is extended whenever a session is active.
- The arguments _user_, _account_, _profile_ and _isNewUser_ are only passed the first time this callback is called on a new session, after the user signs in.

The contents _user_, _account_, _profile_ and _isNewUser_ will vary depending on the provider and on if you are using a database or not. If you want to pass data such as User ID, OAuth Access Token, etc. to the browser, you can persist it in the token and use the `session()` callback to return it.

```js title="pages/api/auth/[...nextauth].js"
...
callbacks: {
  /**
   * @param  {object}  token     Decrypted JSON Web Token
   * @param  {object}  user      User object      (only available on sign in)
   * @param  {object}  account   Provider account (only available on sign in)
   * @param  {object}  profile   Provider profile (only available on sign in)
   * @param  {boolean} isNewUser True if new user (only available on sign in)
   * @return {object}            JSON Web Token that will be saved
   */
  async jwt(token, user, account, profile, isNewUser) {
    // Add access_token to the token right after signin
    if (account?.accessToken) {
      token.accessToken = account.accessToken
    }
    return token
  }
}
...
```

:::tip
Use an if branch in jwt with checking for existence of any other params than token. If any of those exist, you call jwt for the first time.
This is a good place to add for example an `access_token` to your jwt, if you want to.
:::

:::tip
Check out the content of all the params in addition `token`, to see what info you have available on signin.
:::

:::warning
NextAuth.js does not limit how much data you can store in a JSON Web Token, however a ~**4096 byte limit** per cookie is commonly imposed by browsers.

If you need to persist a large amount of data, you will need to persist it elsewhere (e.g. in a database). A common solution is to store a key in the cookie that can be used to look up the remaining data in the database, for example, in the `session()` callback.
:::

## Session callback

The session callback is called whenever a session is checked. By default, only a subset of the token is returned for increased security. If you want to make something available you added to the token through the `jwt()` callback, you have to explicitly forward it here to make it available to the client.

e.g. `getSession()`, `useSession()`, `/api/auth/session`

- When using database sessions, the User object is passed as an argument.
- When using JSON Web Tokens for sessions, the JWT payload is provided instead.

```js title="pages/api/auth/[...nextauth].js"
...
callbacks: {
  /**
   * @param  {object} session      Session object
   * @param  {object} token        User object    (if using database sessions)
   *                               JSON Web Token (if not using database sessions)
   * @return {object}              Session that will be returned to the client
   */
  async session(session, token) {
    // Add property to session, like an access_token from a provider.
    session.accessToken = token.accessToken
    return session
  }
}
...
```

:::tip
When using JSON Web Tokens the `jwt()` callback is invoked before the `session()` callback, so anything you add to the
JSON Web Token will be immediately available in the session callback, like for example an `access_token` from a provider.
:::

:::tip
To better represent its value, when using a JWT session, the second parameter should be called `token` (This is the same thing you return from the `jwt()` callback). If you use a database, call it `user`.
:::

:::warning
The session object is not persisted server side, even when using database sessions - only data such as the session token, the user, and the expiry time is stored in the session table.

If you need to persist session data server side, you can use the `accessToken` returned for the session as a key - and connect to the database in the `session()` callback to access it. Session `accessToken` values do not rotate and are valid as long as the session is valid.

If using JSON Web Tokens instead of database sessions, you should use the User ID or a unique key stored in the token (you will need to generate a key for this yourself on sign in, as access tokens for sessions are not generated when using JSON Web Tokens).
:::
