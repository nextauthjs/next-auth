<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img width="150px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>
   <br/>
   <h3 align="center">NextAuth.js</h3>
   <p align="center">Authentication for Next.js</p>
   <br/>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <img src="https://github.com/nextauthjs/next-auth/workflows/Build%20Test/badge.svg" alt="Build Test" />
      <img src="https://github.com/nextauthjs/next-auth/workflows/Integration%20Test/badge.svg" alt="Integration Test" />
      <img src="https://img.shields.io/bundlephobia/minzip/next-auth" alt="Bundle Size"/>
      <img src="https://img.shields.io/npm/dm/next-auth" alt="Downloads" />
      <img src="https://img.shields.io/github/stars/nextauthjs/next-auth" alt="Github Stars" />
      <img src="https://img.shields.io/github/v/release/nextauthjs/next-auth?include_prereleases" alt="Github Release" />
   </p>
</p>

## Overview

NextAuth.js is a complete open source authentication solution for [Next.js](http://nextjs.org/) applications.

It is designed from the ground up to support Next.js and Serverless.

## Getting Started

```
npm install --save next-auth
```

The easiest way to continue getting started, is to follow the [getting started](https://next-auth.js.org/getting-started/example) section in our docs. 

We also have a section of [tutorials](https://next-auth.js.org/tutorials) for those looking for more specific examples.

See [next-auth.js.org](https://next-auth.js.org) for more information and documentation.

## Features

### Flexible and easy to use

* Designed to work with any OAuth service, it supports OAuth 1.0, 1.0A and 2.0
* Built-in support for [many popular sign-in services](https://next-auth.js.org/configuration/providers)
* Supports email / passwordless authentication
* Supports stateless authentication with any backend (Active Directory, LDAP, etc)
* Supports both JSON Web Tokens and database sessions
* Designed for Serverless but runs anywhere (AWS Lambda, Docker, Heroku, etc…)

### Own your own data

NextAuth.js can be used with or without a database.

* An open source solution that allows you to keep control of your data
* Supports Bring Your Own Database (BYOD) and can be used with any database
* Built-in support for [MySQL, MariaDB, Postgres, Microsoft SQL Server, MongoDB and SQLite](https://next-auth.js.org/configuration/databases)
* Works great with databases from popular hosting providers
* Can also be used *without a database* (e.g. OAuth + JWT)

### Secure by default

* Promotes the use of passwordless sign in mechanisms
* Designed to be secure by default and encourage best practice for safeguarding user data
* Uses Cross Site Request Forgery Tokens on POST routes (sign in, sign out)
* Default cookie policy aims for the most restrictive policy appropriate for each cookie
* When JSON Web Tokens are enabled, they are signed by default (JWS) with HS512
* Use JWT encryption (JWE) by setting the option `encryption: true` (defaults to A256GCM)
* Auto-generates symmetric signing and encryption keys for developer convenience
* Features tab/window syncing and keepalive messages to support short lived sessions
* Attempts to implement the latest guidance published by [Open Web Application Security Project](https://owasp.org/)

Advanced options allow you to define your own routines to handle controlling what accounts are allowed to sign in, for encoding and decoding JSON Web Tokens and to set custom cookie security policies and session properties, so you can control who is able to sign in and how often sessions have to be re-validated. 

### Typescript

You can install the appropriate types via the following command:

```
npm install --save-dev @types/next-auth
```

If you encounter any problems with the types package, please create an issue and add the `typescript` label to it.

Alternatively, you can open a pull request directly with your fixes on the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/next-auth) repository, where you'll find a `next-auth` subfolder.

## Example

### Add API Route

```javascript
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

export default NextAuth({
  providers: [
    // OAuth authentication providers
    Providers.Apple({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    // Sign in with passwordless email link
    Providers.Email({
      server: process.env.MAIL_SERVER,
      from: '<no-reply@example.com>'
    }),
  ],
  // SQL or MongoDB database (or leave empty)
  database: process.env.DATABASE_URL
})
```

### Add React Component

```javascript
import React from 'react'
import { 
  useSession, 
  signin, 
  signout 
} from 'next-auth/client'

export default function myComponent() {
  const [ session, loading ] = useSession()

  return <p>
    {!session && <>
      Not signed in <br/>
      <button onClick={signin}>Sign in</button>
    </>}
    {session && <>
      Signed in as {session.user.email} <br/>
      <button onClick={signout}>Sign out</button>
    </>}
  </p>
}
```

## Acknowledgements

[NextAuth.js is made possible thanks to all of its contributors.](https://next-auth.js.org/contributors)

<a href="https://github.com/nextauthjs/next-auth/graphs/contributors">
  <img width="500px" src="https://contrib.rocks/image?repo=nextauthjs/next-auth" />
</a>

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please first read our [Contributing Guide](https://github.com/iaincollins/next-auth/blob/main/CONTRIBUTING.md).

## License

ISC
