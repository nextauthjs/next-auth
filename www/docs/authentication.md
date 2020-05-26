---
id: rest-api
title: REST API
---

NextAuth.js exposes the following REST API

### GET /api/auth/signin

Displays the sign in page.

### POST /api/auth/signin

Handles email sign in form submission. Requires CSRF token.

### GET /api/auth/callback

Handles redirects from OAuth services during sign in.

### GET /api/auth/signout

Displays the sign out page.

### POST /api/auth/signout

Handles signing out form submission. Requires CSRF token.

### GET /api/auth/session

Returns client-safe session object (or empty object of no session).

### GET /api/auth/csrf

Returns current CSRF to client. Is checked against a signed HttpOnly, host-only cookie.

CSRF protection on authentication requests uses the "double submit cookie method".

### GET /api/auth/providers

Returns a list of configured OAuth services and the configuration (e.g. sign in and callback URLs) for each service. As well as providing a way to check how a client should be configured, it can be used to dynamically generate custom sign up pages.