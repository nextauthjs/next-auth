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

#### CLIENT_SESSION_ERROR

This error occurs when the `SessionProvider` Context has a problem fetching session data.

#### CLIENT_FETCH_ERROR

If you see `CLIENT_FETCH_ERROR` make sure you have configured the `NEXTAUTH_URL` environment variable.

---

## Server

These errors are displayed on the terminal.

### OAuth

#### OAUTH_GET_ACCESS_TOKEN_ERROR

This occurs when there was an error in the POST request to the OAuth provider and we were not able to retrieve the access token.

Please double check your provider settings.

#### OAUTH_V1_GET_ACCESS_TOKEN_ERROR

This error is explicitly related to older OAuth v1.x providers, if you are using one of these, please double check all available settings.

#### OAUTH_GET_PROFILE_ERROR

N/A

#### OAUTH_PARSE_PROFILE_ERROR

This error is a result of either a problem with the provider response or the user cancelling the action with the provider, unfortunately we can't discern which with the information we have.

This error should also log the exception and available `profileData` to further aid debugging.

#### OAUTH_CALLBACK_HANDLER_ERROR

This error will occur when there was an issue parsing the json request body, for example.

There should also be further details logged when this occurs, such as the error thrown, and the request body itself to aid in debugging.

---

### Signin / Callback

#### GET_AUTHORIZATION_URL_ERROR

This error can occur when we cannot get the OAuth v1 request token and generate the authorization URL.

Please double check your OAuth v1 provider settings, especially the OAuth token and OAuth token secret.

#### SIGNIN_OAUTH_ERROR

This error can occur in one of a few places, first during the redirect to the authorization URL of the provider. Next, in the signin flow while creating the PKCE code verifier. Finally, during the generation of the CSRF Token hash in internal state during signin.

Please check your OAuth provider settings and make sure your URLs and other options are correctly set on the provider side.

#### CALLBACK_OAUTH_ERROR

This can occur during handling of the callback if the `code_verifier` cookie was not found or an invalid state was returned from the OAuth provider.

#### SIGNIN_EMAIL_ERROR

This error can occur when a user tries to sign in via an email link; for example, if the email token could not be generated or the verification request failed.

Please double check your email settings.

#### CALLBACK_EMAIL_ERROR

This can occur during the email callback process. Specifically, if there was an error signing the user in via email, encoding the jwt, etc.

Please double check your Email settings.

#### EMAIL_REQUIRES_ADAPTER_ERROR

The Email authentication provider can only be used if a database is configured.

#### CALLBACK_CREDENTIALS_JWT_ERROR

The Credentials Provider can only be used if JSON Web Tokens are used for sessions.

JSON Web Tokens are used for Sessions by default if you have not specified a database. However if you are using a database, then Database Sessions are enabled by default and you need to [explicitly enable JWT Sessions](https://next-auth.js.org/configuration/options#session) to use the Credentials Provider.

If you are using a Credentials Provider, NextAuth.js will not persist users or sessions in a database - user accounts used with the Credentials Provider must be created and managed outside of NextAuth.js.

In _most cases_ it does not make sense to specify a database in NextAuth.js options and support a Credentials Provider.

#### CALLBACK_CREDENTIALS_HANDLER_ERROR

This error occurs when there was no `authorize()` handler defined on the credential authentication provider.

#### PKCE_ERROR

The provider you tried to use failed when setting [PKCE or Proof Key for Code Exchange](https://tools.ietf.org/html/rfc7636#section-4.2).
The `code_verifier` is saved in a cookie called (by default) `__Secure-next-auth.pkce.code_verifier` which expires after 15 minutes.
Check if `cookies.pkceCodeVerifier` is configured correctly. The default `code_challenge_method` is `"S256"`. This is currently not configurable to `"plain"`, as it is not recommended, and in most cases it is only supported for backward compatibility.

---

### Session Handling

#### JWT_SESSION_ERROR

https://next-auth.js.org/errors#jwt_session_error JWKKeySupport: the key does not support HS512 verify algorithm

The algorithm used for generating your key isn't listed as supported. You can generate a HS512 key using

```
  jose newkey -s 512 -t oct -a HS512
```

If you are unable to use an HS512 key (for example to interoperate with other services) you can define what is supported using

```
  jwt: {
    signingKey: {"kty":"oct","kid":"--","alg":"HS256","k":"--"},
    verificationOptions: {
      algorithms: ["HS256"]
    }
  }
```

#### SESSION_ERROR

---

### Signout

#### SIGNOUT_ERROR

This error occurs when there was an issue deleting the session from the database, for example.

---

### Database

These errors are logged by the TypeORM Adapter, which is the default database adapter.

They all indicate a problem interacting with the database.

#### ADAPTER_CONNECTION_ERROR

This error can occur during the `createConnection()` function. Make sure your database connection string / settings are correct and the database is up and ready to receive connections.

#### CREATE_USER_ERROR

N/A

#### GET_USER_BY_ID_ERROR

N/A

#### GET_USER_BY_EMAIL_ERROR

N/A

#### GET_USER_BY_PROVIDER_ACCOUNT_ID_ERROR

N/A

#### LINK_ACCOUNT_ERROR

N/A

#### CREATE_SESSION_ERROR

N/A

#### GET_SESSION_ERROR

N/A

#### UPDATE_SESSION_ERROR

N/A

#### DELETE_SESSION_ERROR

N/A

#### CREATE_VERIFICATION_REQUEST_ERROR

N/A

#### GET_VERIFICATION_REQUEST_ERROR

N/A

#### DELETE_VERIFICATION_REQUEST_ERROR

N/A

---

### Other

#### SEND_VERIFICATION_EMAIL_ERROR

This error occurs when the Email Authentication Provider is unable to send an email.

Check your mail server configuration.

#### MISSING_NEXTAUTH_API_ROUTE_ERROR

This error happens when `[...nextauth].js` file is not found inside `pages/api/auth`.

Make sure the file is there and the filename is written correctly.
