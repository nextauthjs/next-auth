<p align="center">
  <br/>
  <a href="https://authjs.dev" target="_blank"><img width="96px" src="https://authjs.dev/img/logo-sm.png" /></a>
  <h3 align="center">Auth.js</h3>
  <p align="center">Authentication for the Web.</p>
  <p align="center">Open Source. Full Stack. Own Your Data.</p>
  <p align="center" style="align: center;">
    <a href="https://x.com/authjs" ><img src="https://shields.io/badge/Follow @authjs-000?logo=x&style=flat-square" alt="X (formerly known Twitter)" /></a>
    <a href="https://github.com/nextauthjs/next-auth/releases"><img src="https://img.shields.io/npm/v/next-auth/latest?style=flat-square&label=latest%20stable" alt="NPM next-auth@latest release" /></a> 
    <!-- TODO: Should count `@auth/core` when NextAuth.js v5 is released as stable. -->
    <a href="https://www.npmtrends.com/next-auth"><img src="https://img.shields.io/npm/dm/next-auth?style=flat-square&color=cyan" alt="Downloads" /></a>
    <a href="https://github.com/nextauthjs/next-auth/stargazers"><img src="https://img.shields.io/github/stars/nextauthjs/next-auth?style=flat-square&color=orange" alt="GitHub Stars" /></a>
    <!-- <a href="https://codecov.io/gh/nextauthjs/next-auth" ><img alt="Codecov" src="https://img.shields.io/codecov/c/github/nextauthjs/next-auth?token=o2KN5GrPsY&style=flat-square&logo=codecov"></a> -->
    <img src="https://shields.io/badge/TypeScript-3178C6?logo=TypeScript&logoColor=fff&style=flat-square" alt="TypeScript" />
  </p>
  <p align="center">
    Auth.js is a set of open-source packages that are built on standard Web APIs for authentication in modern applications with any framework on any platform in any JS runtime.
  </p>
</p>

> Auth js is now part of [Better Auth](https://better-auth.com/blog/authjs-joins-better-auth). We recommend new projects to start with Better Auth unless there are some very specific feature gaps (most notably stateless session management without a database).

## Features

### Flexible and easy to use

- Designed to work with any OAuth service, it supports 2.0+, OIDC
- Built-in support for [many popular sign-in services](https://github.com/nextauthjs/next-auth/tree/main/packages/core/src/providers)
- Email/Passwordless authentication
- Passkeys/WebAuthn support
- Bring Your Database - or none! - stateless authentication with any backend (Active Directory, LDAP, etc.)
- Runtime-agnostic, runs anywhere! (Docker, Node.js, Serverless, etc.)

### Own your data

Auth.js can be used with or without a database.

- An open-source solution that allows you to keep control of your data
- Built-in support for [MySQL, MariaDB, Postgres, Microsoft SQL Server, MongoDB, SQLite, GraphQL, etc.](https://adapters.authjs.dev)
- Works great with databases from popular hosting providers

### Secure by default

- Promotes the use of passwordless sign-in mechanisms
- Designed to be secure by default and encourage best practices for safeguarding user data
- Uses Cross-Site Request Forgery (CSRF) Tokens on POST routes (sign in, sign out)
- Default cookie policy aims for the most restrictive policy appropriate for each cookie
- When JSON Web Tokens are used, they are encrypted by default (JWE) with A256CBC-HS512
- Features tab/window syncing and session polling to support short-lived sessions
- Attempts to implement the latest guidance published by [Open Web Application Security Project](https://owasp.org)

Advanced configuration allows you to define your routines to handle controlling what accounts are allowed to sign in, for encoding and decoding JSON Web Tokens and to set custom cookie security policies and session properties, so you can control who can sign in and how often sessions have to be re-validated.

### TypeScript

Auth.js libraries are written with type safety in mind. [Check out the docs](https://authjs.dev/getting-started/typescript) for more information.

## Security

If you think you have found a vulnerability (or are not sure) in Auth.js or any of the related packages (i.e. Adapters), we ask you to read our [Security Policy](https://authjs.dev/security) to reach out responsibly. Please do not open Pull Requests/Issues/Discussions before consulting with us.

## Acknowledgments

[Auth.js is made possible thanks to all of its contributors.](https://authjs.dev/contributors)

<a href="https://github.com/nextauthjs/next-auth/graphs/contributors">
  <img width="500px" src="https://contrib.rocks/image?repo=nextauthjs/next-auth" />
</a>
<div>
<a href="https://vercel.com?utm_source=nextauthjs&utm_campaign=oss"></a>
</div>

## Contributing

We're open to all community contributions! If you'd like to contribute in any way, please first read
our [Contributing Guide](https://github.com/nextauthjs/.github/blob/main/CONTRIBUTING.md).

> [!NOTE]
> The Auth.js/NextAuth.js project is not provided by, nor otherwise affiliated with Vercel Inc. or its subsidiaries. Any contributions to this project by individuals affiliated with Vercel are made in their personal capacity.

## License

ISC
