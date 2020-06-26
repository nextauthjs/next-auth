---
id: errors
title: Errors
---

This is a list of errors output from NextAuth.js.

All errors indicate an unexpected problem, you should not expect to see errors.

If you are seeing any of these errors in the console, something is wrong.

---

## Client

These errors are returned from the client. As the client is [Universal JavaScript (or "Isomorphic JavaScript")](https://en.wikipedia.org/wiki/Isomorphic_JavaScript) it can be run on the client or server, so these errors can occur in both in the terminal and in the browser console.

#### CLIENT_USE_SESSION_ERROR

This error occurs when the `useSession()` React Hook has a problem fetching session data.

#### CLIENT_FETCH_ERROR

If you see `CLIENT_FETCH_ERROR` and "_TypeError: Only absolute URLs are supported_" in the console when accessing a page it means you have tried to use the client method server side without first configuring the site name in `pages/app.js` correctly.

* This usually happens when calling `getSession()` from `getServerSideProps()` but the site property in the Provider in `pages/_app.js` is not set.

* Check you have configured your environment variable correctly by [checking out the example project](https://github.com/iaincollins/next-auth-example) and following the instructions in the README.

You should not use log bugs against `CLIENT_FETCH_ERROR` unless you are certain it is a bug in NextAuth.js.

*If it works in the [live demo of the example project](https://next-auth-example.now.sh/ssr) it is not a bug in NextAuth.js*

**How to use getSession() from an API Route**

In the special case of calling `getSession()` in an API route, `pages/_app.js` is not used and won't help.

You can use an undocumented feature called `setOptions()` in API routes to configure the site name so you can use `getSession()` in an API route. This is not yet a supported feature and it's possible it may be changed or removed in future but it exists specifically to address this problem as an interim solution.

_You should not use this approach in pages, only in API routes._

```js
import { setOptions, getSession } from 'next-auth/client'
setOptions({ site: process.env.SITE })

export default async (req, res) =>  {
  const session = await getSession({ req })
  console.log('session', session)
  res.end()
}
```

---

## Server

These errors are displayed on the terminal.

### OAuth

#### OAUTH_GET_ACCESS_TOKEN_ERROR

#### OAUTH_V1_GET_ACCESS_TOKEN_ERROR

#### OAUTH_GET_PROFILE_ERROR

#### OAUTH_PARSE_PROFILE_ERROR

#### OAUTH_CALLBACK_HANDLER_ERROR

---

### Signin / Callback

#### GET_AUTHORISATION_URL_ERROR

#### SIGNIN_OAUTH_ERROR

#### CALLBACK_OAUTH_ERROR

#### SIGNIN_EMAIL_ERROR

#### CALLBACK_EMAIL_ERROR

#### EMAIL_REQUIRES_ADAPTER_ERROR

The Email authentication provider can only be used if a database is configured.

#### CALLBACK_CREDENTIALS_JWT_ERROR

The Credentials authentication provider can only be used if JSON Web Tokens are used for sessions.

#### CALLBACK_CREDENTIALS_HANDLER_ERROR
---

### Session Handling

#### JWT_SESSION_ERROR

#### SESSION_ERROR

---

### Signout

#### SIGNOUT_ERROR

---

### Database

These errors are logged by the TypeORM Adapter, which is the default database adapter.

They all indicate a problem interacting with the database.

#### ADAPTER_CONNECTION_ERROR

#### CREATE_USER_ERROR

#### GET_USER_BY_ID_ERROR

#### GET_USER_BY_EMAIL_ERROR

#### GET_USER_BY_PROVIDER_ACCOUNT_ID_ERROR

#### LINK_ACCOUNT_ERROR

#### CREATE_SESSION_ERROR

#### GET_SESSION_ERROR

#### UPDATE_SESSION_ERROR

#### DELETE_SESSION_ERROR

#### CREATE_VERIFICATION_REQUEST_ERROR

#### GET_VERIFICATION_REQUEST_ERROR

#### DELETE_VERIFICATION_REQUEST_ERROR

---

### Other

#### SEND_VERIFICATION_EMAIL_ERROR

This error occurs when the Email Authentication Provider is unable to send an email.

Check your mail server configuration.
