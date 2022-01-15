<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img width="150px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>
   <h3 align="center">NextAuth.js</h3>
   <p align="center">Authentication for Next.js</p>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <a href="https://github.com/nextauthjs/next-auth/actions/workflows/release.yml?query=workflow%3ARelease">
        <img src="https://github.com/nextauthjs/next-auth/actions/workflows/release.yml/badge.svg" alt="Release" />
      </a>
      <a href="https://bundlephobia.com/result?p=next-auth">
        <img src="https://img.shields.io/bundlephobia/minzip/next-auth" alt="Bundle Size"/>
      </a>
      <a href="https://www.npmtrends.com/next-auth">
        <img src="https://img.shields.io/npm/dm/next-auth" alt="Downloads" />
      </a>
      <a href="https://github.com/nextauthjs/next-auth/stargazers">
        <img src="https://img.shields.io/github/stars/nextauthjs/next-auth" alt="Github Stars" />
      </a>
      <a href="https://www.npmjs.com/package/next-auth">
        <img src="https://img.shields.io/github/v/release/nextauthjs/next-auth?label=latest" alt="Github Stable Release" />
      </a>
      <img src="https://img.shields.io/github/v/release/nextauthjs/next-auth?include_prereleases&label=prerelease&sort=semver" alt="Github Prelease" />
   </p>
</p>

## Overview

NextAuth.js is a complete open source authentication solution for [Next.js](http://nextjs.org/) applications.

It is designed from the ground up to support Next.js and Serverless.

This is the core repo for NextAuth.js. Check the repos below if you are interested in additional information:

- Docs related: https://github.com/nextauthjs/docs
- Adapter related: https://github.com/nextauthjs/adapters

## Getting Started

```
npm install --save next-auth
```

The easiest way to continue getting started, is to follow the [getting started](https://next-auth.js.org/getting-started/example) section in our docs.

We also have a section of [tutorials](https://next-auth.js.org/tutorials) for those looking for more specific examples.

See [next-auth.js.org](https://next-auth.js.org) for more information and documentation.

## Features

### Flexible and easy to use

- Designed to work with any OAuth service, it supports OAuth 1.0, 1.0A and 2.0
- Built-in support for [many popular sign-in services](https://next-auth.js.org/providers/overview)
- Supports email / passwordless authentication
- Supports stateless authentication with any backend (Active Directory, LDAP, etc)
- Supports both JSON Web Tokens and database sessions
- Designed for Serverless but runs anywhere (AWS Lambda, Docker, Heroku, etc…)

### Own your own data

NextAuth.js can be used with or without a database.

- An open source solution that allows you to keep control of your data
- Supports Bring Your Own Database (BYOD) and can be used with any database
- Built-in support for [MySQL, MariaDB, Postgres, Microsoft SQL Server, MongoDB and SQLite](https://next-auth.js.org/configuration/databases)
- Works great with databases from popular hosting providers
- Can also be used _without a database_ (e.g. OAuth + JWT)

### Secure by default

- Promotes the use of passwordless sign-in mechanisms
- Designed to be secure by default and encourage best practices for safeguarding user data
- Uses Cross-Site Request Forgery (CSRF) Tokens on POST routes (sign in, sign out)
- Default cookie policy aims for the most restrictive policy appropriate for each cookie
- When JSON Web Tokens are enabled, they are signed by default (JWS) with HS512
- Use JWT encryption (JWE) by setting the option `encryption: true` (defaults to A256GCM)
- Auto-generates symmetric signing and encryption keys for developer convenience
- Features tab/window syncing and session polling to support short lived sessions
- Attempts to implement the latest guidance published by [Open Web Application Security Project](https://owasp.org)

Advanced options allow you to define your own routines to handle controlling what accounts are allowed to sign in, for encoding and decoding JSON Web Tokens and to set custom cookie security policies and session properties, so you can control who is able to sign in and how often sessions have to be re-validated.

### TypeScript

NextAuth.js comes with built-in types. For more information and usage, check out
the [TypeScript section](https://next-auth.js.org/getting-started/typescript) in the documentation.

## Example

### Add API Route

```javascript
// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth"
import AppleProvider from "next-auth/providers/apple"
import GoogleProvider from "next-auth/providers/google"
import EmailProvider from "next-auth/providers/email"

export default NextAuth({
  secret: process.env.SECRET,
  providers: [
    // OAuth authentication providers
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    // Sign in with passwordless email link
    EmailProvider({
      server: process.env.MAIL_SERVER,
      from: "<no-reply@example.com>",
    }),
  ],
})
```

### Add React Hook

The `useSession()` React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.

```javascript
import { useSession, signIn, signOut } from "next-auth/react"

export default function Component() {
  const { data: session } = useSession()
  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}
```

### Share/configure session state

Use the `<SessionProvider>` to allow instances of `useSession()` to share the session object across components. It also takes care of keeping the session updated and synced between tabs/windows.

```jsx title="pages/_app.js"
import { SessionProvider } from "next-auth/react"

export default function App({
  Component, 
  pageProps: { session, ...pageProps }
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

## Acknowledgments

[NextAuth.js is made possible thanks to all of its contributors.](https://next-auth.js.org/contributors)

<a href="https://github.com/nextauthjs/next-auth/graphs/contributors">
  <img width="500px" src="https://contrib.rocks/image?repo=nextauthjs/next-auth" />
</a>
<div>
<a href="https://vercel.com?utm_source=nextauthjs&utm_campaign=oss"></a>
</div>

### Support

We're happy to announce we've recently created an [OpenCollective](https://opencollective.com/nextauth) for individuals and companies looking to contribute financially to the project!

<!--sponsors start-->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top">
        <a href="https://vercel.com" target="_blank">
          <img width="128px" src="https://avatars.githubusercontent.com/u/14985020?v=4" alt="Vercel Logo" />
        </a><br />
        <div>Vercel</div><br />
        <sub>🥉 Bronze Financial Sponsor <br /> ☁️ Infrastructure Support</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://prisma.io" target="_blank">
          <img width="128px" src="https://avatars.githubusercontent.com/u/17219288?v=4" alt="Prisma Logo" />
        </a><br />
        <div>Prisma</div><br />
        <sub>🥉 Bronze Financial Sponsor</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://clerk.dev" target="_blank">
          <img width="128px" src="https://avatars.githubusercontent.com/u/49538330?s=200&v=4" alt="Prisma Logo" />
        </a><br />
        <div>Clerk</div><br />
        <sub>🥉 Bronze Financial Sponsor</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://checklyhq.com" target="_blank">
          <img width="128px" src="https://avatars.githubusercontent.com/u/25982255?v=4" alt="Checkly Logo" />
        </a><br />
        <div>Checkly</div><br />
        <sub>☁️ Infrastructure Support</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://superblog.ai/" target="_blank">
          <img width="128px" src="https://d33wubrfki0l68.cloudfront.net/cdc4a3833bd878933fcc131655878dbf226ac1c5/10cd6/images/logo_bolt_small.png" alt="superblog Logo" />
        </a><br />
        <div>superblog</div><br />
        <sub>☁️ Infrastructure Support</sub>
      </td>
    </tr><tr></tr>
  </tbody>
</table>
<br />
<!--sponsors end-->

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please first read
our [Contributing Guide](https://github.com/nextauthjs/next-auth/blob/main/CONTRIBUTING.md).

## License

ISC
