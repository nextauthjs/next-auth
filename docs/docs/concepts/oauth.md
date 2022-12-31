---
title: How OAuth works
---

Authentication Providers in **Auth.js** are OAuth definitions that allow your users to sign in with their favorite preexisting logins. You can use any of our many predefined providers, or write your own custom OAuth configuration.

- [Using a built-in OAuth Provider](#built-in-providers) (e.g Github, Twitter, Google, etc...)
- [Using a custom OAuth Provider](#using-a-custom-provider)

:::note
Auth.js is designed to work with any OAuth service, it supports **OAuth 1.0**, **1.0A**, **2.0** and **OpenID Connect** and has built-in support for most popular sign-in services.
:::

Without going into too much detail, the OAuth flow generally has 6 parts:

1. The application requests authorization to access service resources from the user
2. If the user authorized the request, the application receives an authorization grant
3. The application requests an access token from the authorization server (API) by presenting authentication of its own identity, and the authorization grant
4. If the application identity is authenticated and the authorization grant is valid, the authorization server (API) issues an access token to the application. Authorization is complete.
5. The application requests the resource from the resource server (API) and presents the access token for authentication
6. If the access token is valid, the resource server (API) serves the resource to the application

```mermaid
sequenceDiagram
    participant Browser
    participant App Server
    participant Auth Server (Github)
    Note left of Browser: User clicks on "Sign in"
    Browser->>App Server: GET<br/>"api/auth/signin"
    App Server->>App Server: Computes the available<br/>sign in providers<br/>from the "providers" option
    App Server->>Browser: Redirects to Sign in page
    Note left of Browser: Sign in options<br/>are shown the user<br/>(Github, Twitter, etc...)
    Note left of Browser: User clicks on<br/>"Sign in with Github"
    Browser->>App Server: POST<br/>"api/auth/signin/github"
    App Server->>App Server: Computes sign in<br/>options for Github<br/>(scopes, callback URL, etc...)
    App Server->>Auth Server (Github): GET<br/>"github.com/login/oauth/authorize"
    Note left of Auth Server (Github): Sign in options<br> are supplied as<br/>query params<br/>(clientId, <br/>scope, etc...)
    Auth Server (Github)->>Browser: Shows sign in page<br/>in Github.com<br/>to the user
    Note left of Browser: User inserts their<br/>credentials in Github
    Browser->>Auth Server (Github): Github validates the inserted credentials
    Auth Server (Github)->>Auth Server (Github): Generates one time access code<br/>and calls callback<br>URL defined in<br/>App settings
    Auth Server (Github)->>App Server: GET<br/>"api/auth/github/callback?code=123"
    App Server->>App Server: Grabs code<br/>to exchange it for<br/>access token
    App Server->>Auth Server (Github): POST<br/>"github.com/login/oauth/access_token"<br/>{code: 123}
    Auth Server (Github)->>Auth Server (Github): Verifies code is<br/>valid and generates<br/>access token
    Auth Server (Github)->>App Server: { access_token: 16C7x... }
    App Server->>App Server: Generates session token<br/>and stores session
    App Server->>Browser: You're now logged in!
```

For more details, check out Aaron Parecki's blog post [OAuth2 Simplified](https://aaronparecki.com/oauth-2-simplified/) or Postman's blog post [OAuth 2.0: Implicit Flow is Dead, Try PKCE Instead](https://blog.postman.com/pkce-oauth-how-to/).
