<p align="center">
  <br/>
  <a href="https://authjs.dev" target="_blank"><img width="96px" src="https://authjs.dev/img/logo/logo-sm.png" /></a>
  <h3 align="center">Auth.js</h3>
  <p align="center">Authentication for the Web.</p>
  <p align="center">Open Source. Full Stack. Own Your Data.</p>
  <p align="center" style="align: center;">
    <a href="https://npm.im/@auth/prisma-adapter">
      <img src="https://img.shields.io/badge/TypeScript-blue?style=flat-square" alt="TypeScript" />
    </a>
    <a href="https://www.npmtrends.com/next-auth">
      <img src="https://img.shields.io/npm/dm/next-auth?style=flat-square" alt="Downloads" />
    </a>
    <a href="https://github.com/nextauthjs/next-auth/stargazers">
      <img src="https://img.shields.io/github/stars/nextauthjs/next-auth?style=flat-square" alt="Github Stars" />
    </a>
    <a href="https://www.npmjs.com/package/next-auth">
      <img src="https://img.shields.io/github/v/release/nextauthjs/next-auth?label=latest&style=flat-square" alt="Github Stable Release" />
    </a>
  </p>
</p>

Auth.js is a set of open-source packages that are built on Web Standard APIs for authentication in modern applications with any framework on any platform in any JS runtime.

See [authjs.dev](https://authjs.dev) for our framework-specific libraries, or check out [next-auth.js.org](https://next-auth.js.org) for `next-auth` (Next.js).

## Features

### Flexible and easy to use

- Designed to work with any OAuth service, it supports 2.0+, OIDC
- Built-in support for [many popular sign-in services](https://github.com/nextauthjs/next-auth/tree/main/packages/core/src/providers)
- Email/Passwordless authentication
- Bring Your Database - or none! - stateless authentication with any backend (Active Directory, LDAP, etc.)
- Runtime-agnostic, runs anywhere! (Vercel Edge Functions, Node.js, Serverless, etc.)

### Own your data

Auth.js can be used with or without a database.

- An open-source solution that allows you to keep control of your data
- Built-in support for [MySQL, MariaDB, Postgres, Microsoft SQL Server, MongoDB, SQLite, etc.](https://adapters.authjs.dev)
- Works great with databases from popular hosting providers

### Secure by default

- Promotes the use of passwordless sign-in mechanisms
- Designed to be secure by default and encourage best practices for safeguarding user data
- Uses Cross-Site Request Forgery (CSRF) Tokens on POST routes (sign in, sign out)
- Default cookie policy aims for the most restrictive policy appropriate for each cookie
- When JSON Web Tokens are used, they are encrypted by default (JWE) with A256GCM
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

### Sponsors

<a href="https://clerk.com?utm_source=sponsorship&utm_medium=github&utm_campaign=authjs&utm_content=callout">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/static/img/clerk-readme-light.png">
    <source media="(prefers-color-scheme: light)" srcset="docs/static/img/clerk-readme-dark.png">
    <img alt="Clerk – Authentication & User Management" src="docs/static/img/clerk-readme-dark.png" width="830">
  </picture>
</a>
<br><br>

We have an [OpenCollective](https://opencollective.com/nextauth) for companies and individuals looking to contribute financially to the project!

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
        <a href="https://clerk.com" target="_blank">
          <img width="128px" src="https://avatars.githubusercontent.com/u/49538330?s=200&v=4" alt="Clerk Logo" />
        </a><br />
        <div>Clerk</div><br />
        <sub>🥉 Bronze Financial Sponsor</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://lowdefy.com" target="_blank">
          <img width="128px" src="https://avatars.githubusercontent.com/u/47087496?s=200&v=4" alt="Lowdefy Logo" />
        </a><br />
        <div>Lowdefy</div><br />
        <sub>🥉 Bronze Financial Sponsor</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://workos.com" target="_blank">
          <img width="128px" src="https://avatars.githubusercontent.com/u/47638084?s=200&v=4" alt="WorkOS Logo" />
        </a><br />
        <div>WorkOS</div><br />
        <sub>🥉 Bronze Financial Sponsor</sub>
      </td>
      <td align="center" valign="top">
        <a href="https://www.descope.com" target="_blank">
          <img width="128px" src="https://avatars.githubusercontent.com/u/97479186?v=4" alt="Descope Logo" />
        </a><br />
        <div>Descope</div><br />
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
our [Contributing Guide](https://github.com/nextauthjs/.github/blob/main/CONTRIBUTING.md).

## License

ISC
