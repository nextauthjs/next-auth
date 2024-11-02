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
      <a href="https://packagephobia.com/result?p=next-auth">
        <img src="https://packagephobia.com/badge?p=next-auth" alt="Bundle Size"/>
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
   </p>
</p>

## Overview

NextAuth.js is a complete open source authentication solution for [Next.js](http://nextjs.org/) applications.

It is designed from the ground up to support Next.js and Serverless.

This is a monorepo containing the following packages / projects:

1. The primary `next-auth` package
2. A development test application
3. All `@next-auth/*-adapter` packages
4. The documentation site

## Getting Started

```
npm install next-auth
```

The easiest way to continue getting started, is to follow the [getting started](https://next-auth.js.org/getting-started/example) section in our docs.

We also have a section of [tutorials](https://next-auth.js.org/tutorials) for those looking for more specific examples.

See [next-auth.js.org](https://next-auth.js.org) for more information and documentation.

## Features

### Flexible and easy to use

- Designed to work with any OAuth service, it supports OAuth 1.0, 1.0A and 2.0
- Built-in support for [many popular sign-in services](https://next-auth.js.org/providers)
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
- When JSON Web Tokens are enabled, they are encrypted by default (JWE) with A256GCM
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
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

## Security

If you think you have found a vulnerability (or not sure) in NextAuth.js or any of the related packages (i.e. Adapters), we ask you to have a read of our [Security Policy](https://github.com/nextauthjs/next-auth/security/policy) to reach out responsibly. Please do not open Pull Requests/Issues/Discussions before consulting with us.

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
        <a href="https://clerk.com?utm_source=sponsorship&utm_medium=github&utm_campaign=authjs&utm_content=sponsor" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/49538330?s=200&v=4" alt="Clerk Logo" />
        </a><br />
        <div>Clerk</div>
        <sub>💵</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://a0.to/signup/nextauthjs" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/2824157?v=4" alt="Auth0 Logo" />
        </a><br />
        <div>Auth0</div>
        <sub>💵</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://fusionauth.io" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/41974756?s=200&v=4" alt="FusionAuth Logo" />
        </a><br />
        <div>FusionAuth</div>
        <sub>💵</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://stytch.com" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/69983493?s=200&v=4" alt="Stytch Logo" />
        </a><br />
        <div>Stytch</div>
        <sub>💵</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://prisma.io" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/17219288?s=200&v=4" alt="Prisma Logo" />
        </a><br />
        <div>Prisma</div>
        <sub>💵</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://neon.tech" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/77690634?v=4" alt="Neon Logo" />
        </a><br />
        <div>Neon</div>
        <sub>💵</sub>
      </td>
    </tr>
    <tr>
      <td align="center" valign="top">
        <a href="https://www.beyondidentity.com" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/69811361?s=200&v=4" alt="Beyond Identity Logo" />
        </a><br />
        <div>Beyond Identity</div>
        <sub>💵</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://lowdefy.com" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/47087496?s=200&v=4" alt="Lowdefy Logo" />
        </a><br />
        <div>Lowdefy</div>
        <sub>💵</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://www.descope.com" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/97479186?s=200&v=4" alt="Descope Logo" />
        </a><br />
        <div>Descope</div>
        <sub>💵</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://badass.dev" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/136839242?v=4" alt="Badass Courses Logo" />
        </a><br />
        <div>Badass Courses</div>
        <sub>💵</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://github.com/encoredev/encore" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/50438175?v=4" alt="Encore Logo" />
        </a><br />
        <div>Encore</div>
        <sub>💵</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://sent.dm/?ref=auth.js" target="_blank">
          <img width="108" src="https://avatars.githubusercontent.com/u/153308555?v=4" alt="Sent.dm Logo" />
        </a><br />
        <div>Sent.dm</div>
        <sub>💵</sub>
      </td>
    </tr>
    <tr>
      <td align="center" valign="top">
        <a href="https://arcjet.com/?ref=auth.js" target="_blank">
          <img width="108" src="https://avatars.githubusercontent.com/u/24397786?s=200&v=4" alt="Arcjet Logo" />
        </a><br />
        <div>Arcjet</div>
        <sub>💵</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://route4me.com/?ref=auth.js" target="_blank">
          <img width="108" src="https://avatars.githubusercontent.com/u/7936820?v=4" alt="Route4Me Logo" />
        </a><br />
        <div>Route4Me</div>
        <sub>💵</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://www.netlight.com/" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/1672348?s=200&v=4" alt="Netlight logo" />
        </a><br />
        <div>Netlight</div>
        <sub>☁️</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://checklyhq.com" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/25982255?s=200&v=4" alt="Checkly Logo" />
        </a><br />
        <div>Checkly</div>
        <sub>☁️</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://superblog.ai/" target="_blank">
          <img height="96" src="https://d33wubrfki0l68.cloudfront.net/cdc4a3833bd878933fcc131655878dbf226ac1c5/10cd6/images/logo_bolt_small.png" alt="superblog Logo" />
        </a><br />
        <div>superblog</div>
        <sub>☁️</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://vercel.com" target="_blank">
          <img height="96" src="https://avatars.githubusercontent.com/u/14985020?s=200&v=4" alt="Vercel Logo" />
        </a><br />
        <div>Vercel</div>
        <sub>☁️</sub>
      </td>
    </tr>
  </tbody>
</table>

- 💵 Financial Sponsor
- ☁️ Infrastructure Support

<br />
<!--sponsors end-->


## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please first read
our [Contributing Guide](https://github.com/nextauthjs/.github/blob/main/CONTRIBUTING.md).

## License

ISC
