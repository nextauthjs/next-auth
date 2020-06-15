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

#### CLIENT_FETCH_ERROR

#### CLIENT_COOKIE_PARSE_ERROR

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
