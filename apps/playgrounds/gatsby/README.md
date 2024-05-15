> The example repository is maintained from a [monorepo](https://github.com/nextauthjs/next-auth/tree/main/apps/playground-gatsby). Pull Requests should be opened against [`nextauthjs/next-auth`](https://github.com/nextauthjs/next-auth).

<p align="center">
   <br/>
   <a href="https://authjs.dev" target="_blank"><img width="150px" src="https://authjs.dev/img/logo-sm.png" /></a>
   <h3 align="center">Auth.js Example App</h3>
   <p align="center">
   Open Source. Full Stack. Own Your Data.
   </p>
   <p align="center" style="align: center;">
      <a href="https://npm.im/next-auth">
        <img alt="npm" src="https://img.shields.io/npm/v/@auth/core?color=green&label=@auth/core&style=flat-square">
      </a>
      <a href="https://bundlephobia.com/result?p=@auth/core">
        <img src="https://img.shields.io/bundlephobia/minzip/@auth/core?label=bundle&style=flat-square" alt="Bundle Size"/>
      </a>
      <a href="https://www.npmtrends.com/@auth/core">
        <img src="https://img.shields.io/npm/dm/@auth/core?label=downloads&style=flat-square" alt="Downloads" />
      </a>
   </p>
</p>

## Overview

Auth.js is a complete open-source authentication solution.

This is an example application that shows how `@auth/core` is applied to a basic Gatsby app. We are showing how to configure the backend both as a [Vercel Function](https://vercel.com/docs/concepts/functions/introduction) for deployment to Vercel, and also for [Gatsby Functions](https://www.gatsbyjs.com/docs/reference/functions) for other platforms.

The deployed version can be found at [`next-auth-gatsby-example.vercel.app`](https://next-auth-gatsby-example.vercel.app)

### About Auth.js

Auth.js is an easy-to-implement, full-stack (client/server) open-source authentication library originally designed for [Next.js](https://nextjs.org) and [Serverless](https://vercel.com), but this example shows how to use it in a Gatsby project. Our goal is to [support even more frameworks](https://github.com/nextauthjs/next-auth/issues/2294) in the future.

Go to [authjs.dev](https://authjs.dev) for more information and documentation.

> Auth.js is not officially associated with Vercel or Next.js.\_

## Getting Started

### 1. Clone the repository and install dependencies

```
git clone https://github.com/nextauthjs/next-auth-gatsby-example.git
cd next-auth-gatsby-example
npm install
```

### 2. Configure your local environment

Copy the .env.local.example file in this directory to .env.local (which will be ignored by Git):

```
cp .env.local.example .env.local
```

Add details for one or more providers (e.g. Google, Twitter, GitHub, Email, etc).

#### Database

A database is needed to persist user accounts and to support email sign in. However, you can still use Auth.js for authentication without a database by using OAuth for authentication. If you do not specify a database, [JSON Web Tokens](https://jwt.io/introduction) will be enabled by default.

You **can** skip configuring a database and come back to it later if you want.

For more information about setting up a database, please check out the following links:

- Docs: [authjs.dev/reference/core/adapters](https://authjs.dev/reference/core/adapters)

### 3. Configure Authentication Providers

1. Review and update options in `nextauth.config.js` as needed.

2. When setting up OAuth, in the developer admin page for each of your OAuth services, you should configure the callback URL to use a callback path of `{server}/api/auth/callback/{provider}`.

e.g. For Google OAuth you would use: `http://localhost:3000/api/auth/callback/google`

A list of configured providers and their callback URLs is available from the endpoint `/api/auth/providers`. You can find more information at [authjs.dev/reference/core/providers](https://authjs.dev/reference/core/providers).

3. You can also choose to specify an SMTP server for passwordless sign in via email.

### 4. Start the application

To run your site locally, use:

```
npm run dev
```

To run it in production mode, use:

```
npm run build
npm run start
```

### 5. Preparing for Production

Follow the [Deployment documentation](https://authjs.dev/getting-started/deployment)

## Acknowledgements

<a href="https://vercel.com?utm_source=authjs&utm_campaign=oss">
<img width="170px" src="https://raw.githubusercontent.com/nextauthjs/next-auth/main/docs/public/img/etc/powered-by-vercel.svg" alt="Powered By Vercel" />
</a>
<p align="left">Thanks to Vercel sponsoring this project by allowing it to be deployed for free for the entire Auth.js Team</p>

## License

ISC
