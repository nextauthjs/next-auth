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

#### Server Side Rendering

Authentication when Server Side Rendering is also supported with `session()`, which can be called client or server side:

```javascript
import NextAuth from 'next-auth/client'

export default ({ session }) => <>
  {session && <p>Signed in as {session.user.name || session.user.email}.</p>}
  {!session && <p><a href="/api/auth/signin">Sign in here</a></p>}
</>

export async function getInitialProps({req}) {
  const session = await NextAuth.session({req})
  return {
    session
  }
}
```

You can use this method and the `useSession()` hook together - the hook can be pre-populated with the session object from the server side call, so that it is avalible immediately when the page is loaded, and updated client side when the page is viewed in the browser.

You can call `NextAuth.session()` function in client side JavaScript, without needing to pass a `req` object - the `req` object is only needed when calling the function from `getServerSideProps` or `getInitialProps`.

## Configuration

Configuration options are passed to NextAuth when initalizing it (in your `/api/` route).

The only things you will probably *need* to configure are your site name (e.g. 'http://www.example.com'), which should be set explicitly for security reasons, a list of authentication services (Twitter, Facebook, Google, etc) and a database adapter.

An "*Adapter*" in NextAuth is the thing that connects your application to whatever database / backend system you want to use to store data for user accounts, sessions, etc.

NextAuth comes with a default adapter that uses [TypeORM](https://typeorm.io/) so that it can be be used with many different databases without any configuration, you simply add the database driver you want to use to your project and tell NextAuth to use it.

If you have an existing database / user management system or want to use a database that isn't supported out of the box you can create and pass your own adapter to handle actions like `createAccount`, `deleteAccount`, (etc).

### Simple Example

This is an example of how to use an SQLite in memory database, which can be useful for development and testing, and to check everything is working:

1. Install the database driver as a dependancy in the usual way - e.g. `npm i sqlite3`
2. Pass a *TypeORM* configuration object when calling `NextAuth()` in your API route.

e.g.

```javascript
adapter: Adapters.Default({
  type: 'sqlite',
  database: ':memory:'
}),
```

You can pass database credentials securely, using environment variables for options. See the [TypeORM configuration documentation](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) for more details about supported options.

### Supported Databases

The following databases are supported by the default adapter:

* cordova
* expo
* mariadb
* mongodb
* mssql
* mysql
* oracle
* postgres
* sqlite
* sqljs
* react-native

Appropriate tables / collections for Users, Sessions (etc) will be created automatically.

You can customize, extend or replace the models by passing additional options to the `Adapters.Default()` function.

If you are using a database that is not supported out of the box - or if you want to use NextAuth with an existing database (or have a more complex setup, with accounts and sessions spread across different systems - you can pass your own methods to be called for user and session creation / deletion (etc).

**Important! Supported databases and models/scehams subject to change before release.**

## Customization

NextAuth automatically creates simple, unbranded authentication pages for handling Sign in, Email Verification, callbacks, etc.

The options displayed are generated based on the configuration supplied.

You can create custom authentication pages if you would like to customize the experience.

*This documentation will be updated closer to release.*