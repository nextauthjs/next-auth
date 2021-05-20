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

If you see `CLIENT_FETCH_ERROR` make sure you have configured the `NEXTAUTH_URL` envionment variable.

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

#### GET_AUTHORIZATION_URL_ERROR

#### SIGNIN_OAUTH_ERROR

#### CALLBACK_OAUTH_ERROR

#### SIGNIN_EMAIL_ERROR

#### CALLBACK_EMAIL_ERROR

#### EMAIL_REQUIRES_ADAPTER_ERROR

The Email authentication provider can only be used if a database is configured.

#### CALLBACK_CREDENTIALS_JWT_ERROR

The Credentials Provider can only be used if JSON Web Tokens are used for sessions.

JSON Web Tokens are used for Sessions by default if you have not specified a database. However if you are using a database, then Database Sessions are enabled by default and you need to [explictly enable JWT Sessions](https://next-auth.js.org/configuration/options#session) to use the Credentials Provider.

If you are using a Credentials Provider, NextAuth.js will not persist users or sessions in a database - user accounts used with the Credentials Provider must be created and manged outside of NextAuth.js.

In _most cases_ it does not make sense to specify a database in NextAuth.js options and support a Credentials Provider.

#### CALLBACK_CREDENTIALS_HANDLER_ERROR

#### PKCE_ERROR

The provider you tried to use failed when setting [PKCE or Proof Key for Code Exchange](https://tools.ietf.org/html/rfc7636#section-4.2).
The `code_verifier` is saved in a cookie called (by default) `__Secure-next-auth.pkce.code_verifier` which expires after 15 minutes.
Check if `cookies.pkceCodeVerifier` is configured correctly. The default `code_challenge_method` is `"S256"`. This is currently not configurable to `"plain"`, as it is not recommended, and in most cases it is only supported for backward compatibility.
---

### Session Handling

#### JWT_SESSION_ERROR

https://next-auth.js.org/errors#jwt_session_error JWKKeySupport: the key does not support HS512 verify algorithm

The algorithm used for generating your key isn't listed as supported. You can generate a HS512 key using

````
  jose newkey -s 512 -t oct -a HS512
````

If you are unable to use an HS512 key (for example to interoperate with other services) you can define what is supported using

````
  jwt: {
    signingKey: {"kty":"oct","kid":"--","alg":"HS256","k":"--"},
    verificationOptions: {
      algorithms: ["HS256"]
    }
  }
````

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

#### MISSING_NEXTAUTH_API_ROUTE_ERROR

This error happens when `[...nextauth].js` file is not found inside `pages/api/auth`.

Make sure the file is there and the filename is written correctly.
