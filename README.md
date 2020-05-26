# NextAuth.js

**https://next-auth.js.org**

## About NextAuth.js

This is a beta release of [NextAuth.js v2](https://github.com/iaincollins/next-auth/), an open source authentication library for Next.js and Serverless.

It allows you to easily add sign in support to an application, without any third party service dependencies.
 
You choose your authentication providers (Google, Facebook, Email, etc) and add your database details (MySQL, Postgres, MongoDB, etc) and NextAuth does the rest!

### Features

* Built for Next.js and for Serverless (but works in any environment)
* Lightweight, doesn't depend on Express or Passport.js
* Supports Auth 1.x, OAuth 2.x and email / passwordless authentication 
* Out of the box support for signing in with Google, Facebook, Twitter, GitHub, Slack, Discord, Twitch and other providers
* Extremely simple to use client, with `useSession()` hook and a universal `session()` method
* Doesn't require client-side JavaScript
* Supports both SQL and document storage databases with the default database adapter ([TypeORM](https://typeorm.io/))
* Secure / host-only and HttpOnly signed cookies; session ID never exposed to client-side JavaScript
* Cross-site Request Forgery protection (double submit cookie method with a signed, HttpOnly, host-only prefix)
* Fully customizable web pages and emails

*Note: NextAuth.js is not associated with Vercel or Next.js.*

## Getting Started

NextAuth.js supports both SQL and Document databases out of the box.

For example code and the latest documentation, go to [**next-auth.js.org**](https://next-auth.js.org)
