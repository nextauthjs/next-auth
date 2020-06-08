# NextAuth.js

## Overview

NextAuth.js is a complete open source authentication solution for [Next.js](http://nextjs.org/) applications.

It is designed from the ground up to support Next.js and Serverless.

[Follow the examples](https://next-auth.js.org/getting-started/example) to see how easy it is to use NextAuth.js for authentication.

Install: `npm i next-auth`

See [next-auth.js.org](https://next-auth.js.org) for more information and documentation.

## Features

### Authentication

* Designed to work with any 0Auth service, it supports 0Auth 1.0, 1.0A and 2.0
* Built-in support for [many popular 0Auth sign-in services](https://next-auth.js.org/options/providers)
* Supports email / passwordless authentication
* Supports both JSON Web Tokens and database sessions

### Own your own data

* An open source solution that allows you to keep control of your data
* Supports Bring Your Own Database (BYOD) and can be used with any database
* Built-in support for for [MySQL, MariaDB, Postgres, MongoDB and SQLite](https://next-auth.js.org/options/database)
* Works great with databases from popular hosting providers
* Can also be used without a database (e.g. OAuth + JWT)

### Secure by default

* Designed to be secure by default and promote best practice for safeguarding user data
* Attempts to implement the latest guidance published by [Open Web Application Security Project](https://owasp.org/)

Security focused features include CSRF protection, use of signed cookies, cookie prefixes, secure cookies, HTTP only, host only and secure only cookies and promoting passwordless sign-in.

## Example

### Add API Route

```javascript
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

const options = {
  site: 'https://example.com'
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
}

export default (req, res) => NextAuth(req, res, options)
```

### Add React Component

```javascript
import React from 'react'
import { 
  useSession, 
  signin, 
  signout 
} from 'next-auth/client'

export default () => {
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

## Acknowledgement

[NextAuth.js 2.0 is possible thanks to its contributors.](https://next-auth.js.org/contributors)

## Getting started

[Follow the examples to get started.](https://next-auth.js.org/getting-started/example)
