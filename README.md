# NextAuth

## About NextAuth

This is work in progress of version 2.0 of [NextAuth](https://github.com/iaincollins/next-auth/), an authentication library for Next.js.

**Version 2.0 is a complete re-write, designed from the ground up for serverless.**

NextAuth is a complete self-hosted application solution for Next.js applications.

It allows you to easily add sign in support to an application, without any third party service dependancies.
 
You provide database connnection details (MySQL, Postgres, MongoDB, etc) and NextAuth does the rest!

 ### Features

* Built for Next.js and for Serverless (but works in any environment)
* Lightweight - doesn't depend on Express or PassportJS
* Supports oAuth 1.x, oAuth 2.x and email / passwordless authentication 
* Out of the box support for signing in with Google, Facebook, Twitter, GitHub, Slack, Discord, Twitch and other providers
* Exteremly simple to use client, with `useSession()` hook and isomorphic `session()` method
* Supports both SQL and document storage databases with the default database adapter ([TypeORM](https://typeorm.io/))
* Secure / host only and http only signed cookies; session ID never exposed to client side JavaScript
* Cross Site Request Forgery proteciton (using double submit cookie method with a signed, HTTP only, host only prefixed cookie)
* Works without JavaScript in the client (e.g. great for integration with Google AMP)
* Designed to support code splitting to reduce deployed application size

*Note: NextAuth is not associated with Next.js or Vercel.*

## Getting Started

NextAuth supports both SQL and Document databases out of the box.

There are predefined models for Users and Sessions, which you can use (or extend or replace with your own models/schemas).

[**Documentation**](https://next-auth-docs.now.sh/)

### Server

To add `next-auth` to a project, create a file to handle authentication requests at `pages/api/auth/[...slug.js]`:

```javascript
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'

// Database options - the default adapter is TypeORM
// See https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md
const database = {
  type: 'sqlite',
  database: ':memory:',
}

// NextAuth Options
const options = {
  site: process.env.SITE || 'http://localhost:3000',
  providers: [
    Providers.Twitter({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),
  ],
  adapter: Adapters.Default(database)
}

export default (req, res) => NextAuth(req, res, options)
```

All requests to `pages/api/auth/*` (signin, callback, signout, etc) will now be automatically handed by NextAuth.

*Note: Your project will need an NPM module suitable for your database installed (e.g. `npm i sqlite3`).*

### Client 

You can now use the `useSession()` hook to see if a user is signed in!

```javascript
import NextAuth from 'next-auth'

export default () => {
  const [session, loading] = NextAuth.useSession()

  return <>
    {loading && <p>Checking session…</p>}
    {!loading && session && <p>Signed in as {session.user.name || session.user.email}.</p>}
    {!loading && !session && <p><a href="/api/auth/signin">Sign in here</p>}
  </>
}
```

*This is all the code you need to add support for signing in to a project!*

#### Adding to _app.js

While calling `useSession()` like this will work perfectly well, it will do network request to get the session in each component you use it in. To reduce network load and improve performance, you can wrap your component tree in our `Provider`, which will make `useSession()` use [React Context](https://reactjs.org/docs/context.html) instead.

You can use this `Provider` on specific pages or add it to all by adding to your `pages/_app.js` ([Next.js docs for _app.js](https://nextjs.org/docs/advanced-features/custom-app)):

```javascript
import NextAuth from 'next-auth'

export default ({ Component, pageProps }) => {
  return (
    <NextAuth.Provider>
      <Component {...pageProps} />
    </NextAuth.Provider>
  )
}
```

### Further customisation and setup options are available in our docs [here](https://next-auth-docs.now.sh/)
