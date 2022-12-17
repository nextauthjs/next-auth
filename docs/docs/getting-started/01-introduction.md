---
title: Introduction
---

## About Auth.js

Auth.js is a complete open-source authentication solution for [Next.js](http://nextjs.org/) applications.

It is designed from the ground up to support Next.js and Serverless.

Check our tutorials to see how easy it is to use Auth.js for authentication:

- [Setup with OAuth](/getting-started/oauth-tutorial)
- [Setup with magic links](/getting-started/email-tutorial)
- [Integrating with external auth](/getting-started/credentials-tutorial)

### Flexible and easy to use

- Designed to work with any OAuth service, it supports OAuth 1.0, 1.0A, 2.0 and OpenID Connect
- Built-in support for [many popular sign-in services](/reference/providers/oauth-builtin)
- Supports [email / passwordless authentication](/getting-started/email-tutorial)
- Supports stateless authentication with [any backend](/getting-started/credentials-tutorial) (Active Directory, LDAP, etc)
- Supports both JSON Web Tokens and database sessions
- Designed for Serverless but runs anywhere (AWS Lambda, Docker, Heroku, etc…)

### Own your own data

Auth.js can be used with or without a database.

- An open-source solution that allows you to keep control of your data
- Supports Bring Your Own Database (BYOD) and can be used with any database
- Built-in support for [MySQL, MariaDB, Postgres, SQL Server, MongoDB and SQLite](/getting-started/databases)
- Works great with databases from popular hosting providers
- Can also be used _without a database_ (e.g. OAuth + JWT)

_Note: Email sign-in requires a database to be configured to store single-use verification tokens._

### Secure by default

- Promotes the use of passwordless sign-in mechanisms
- Designed to be secure by default and encourage best practices for safeguarding user data
- Uses Cross-Site Request Forgery Tokens on POST routes (sign in, sign out)
- Default cookie policy aims for the most restrictive policy appropriate for each cookie
- When JSON Web Tokens are enabled, they are encrypted by default (JWE) with A256GCM
- Auto-generates symmetric signing and encryption keys for developer convenience
- Features tab/window syncing and keepalive messages to support short-lived sessions
- Attempts to implement the latest guidance published by [Open Web Application Security Project](https://owasp.org/)

Advanced options allow you to define your own routines to handle controlling what accounts are allowed to sign in, for encoding and decoding JSON Web Tokens and to set custom cookie security policies and session properties, so you can control who can sign in and how often sessions have to be re-validated.

## Credits

Auth.js is an open-source project that is only possible [thanks to contributors](/contributors).

If you would like to financially support the development of Auth.js, you can find more information on our [OpenCollective](https://opencollective.com/nextauth) page.
