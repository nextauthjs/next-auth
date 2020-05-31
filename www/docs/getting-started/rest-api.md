---
id: rest-api
title: REST API
---

NextAuth.js exposes a REST API, which is used by the NextAuth.js client.

:::note
The default base path is `/api/auth`, this is configurable with the `basePath` option.
:::

### GET /api/auth/signin

Displays the sign in page.

### GET /api/auth/signin/:provider

Starts an OAuth signin flow for the specified provider.

### POST /api/auth/signin/:provider

A POST submission is required for email sign in.

The POST submission requires CSRF token from `/api/auth/csrf`.

### GET /api/auth/callback/:provider

Handles retuning requests from OAuth services during sign in.

### GET /api/auth/signout

Displays the sign out page.

### POST /api/auth/signout

Handles signing out - this is a POST submission to prevent malicious links from triggering signing a user out without their consent.

The POST submission requires CSRF token from `/api/auth/csrf`.

### GET /api/auth/session

Returns client-safe session object - or an empty object if there is no session.

### GET /api/auth/csrf

Returns object containing CSRF token. In NextAuth.js, CSRF protection is present on all authentication routes. It uses the "double submit cookie method", which uses a signed HttpOnly, host-only cookie.

The CSRF token returned by this endpoint must be passed as form variable named `csrfToken` in all POST submissions to any API endpoint.

### GET /api/auth/providers

Returns a list of configured OAuth services and the configuration (e.g. sign in and callback URLs) for each service.

It can be used to dynamically generate custom sign up pages and to check what callback URLs are configured for each OAuth provider that is configured.