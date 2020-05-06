# NextAuth

## About NextAuth

This is work in progress of version 2.0 of [NextAuth](https://github.com/iaincollins/next-auth/), an authentication library for Next.js.

**Version 2.0 is a complete re-write, designed from the ground up for serverless.**

* Built for Serverless - unlike version 1.x it doesn't depend on Express or PassportJS (but is compatible with them) and is designed to support automatic code splitting at build time for optimal bundle size and performance.
* Supports the same oAuth 1.x and oAuth 2.x and email authentication flows as version 1.x (both client and server side).
* Simple configuration with out-of-the-box support for common oAuth providers and databases.

If you are familiar with version 1.x you will appreciate the much simpler and hassle free configuration, especially for provider configuration, database adapters and much improved Cross Site Request Forgery token handling (now enabled by default *for next-auth routes only*).

Additional options and planned features will be announced closer to release.

Note: NextAuth is not associated with Next.js or Vercel.

## Getting Started

Configuration is much simpler and more powerful than in NextAuth 1.0, with both SQL and Document databases supported out of the box. There are predefined models for Users and Sessions, which you can use (or extend or replace with your own models/schemas).

### Code

### Server

To add `next-auth` to a project, create a file to handle authentication requests at `pages/api/auth/[...slug.js]`:

```javascript
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'

const options = {
  site: process.env.SITE_NAME || 'http://localhost:3000',
  providers: [
    Providers.Twitter({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
    Providers.Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET
    }),
  ],
  adapter: Adapters.Default()
}

export default (req, res) => NextAuth(req, res, options)
```

All requests to `pages/api/auth/*` (signin, callback, signout) will now be automatically handed by NextAuth.

### Client

You can now use the can use the `useSession()` hook to see if a user is signed in.

```javascript
export default () => {
  const [session, loading] = NextAuth.useSession()

  return <>
    {loading && <p>Loading session…</p>}
    {!loading && session && <p>Logged in as {session.user.name || session.user.email}.</p>}
    {!loading && !session && <p>Not logged in.</p>}
  </>
}
```

*This is all the code you need to add support for signing in to a project!*

### Authentication with Server Side Rendering

Authentication with Server Side Rendering is also supported.

```javascript
import NextAuth from 'next-auth/client'

export default ({ session }) => <>
  {session && <p>You are logged in as {session.user.name || session.user.email}.</p>}
  {!session && <p>You are not logged in.</p>}
</>

export async function getServerSideProps({req}) {
  const session = await NextAuth.session({req})
  return {
    props: {
      session
    }
  }
}
```

You can use this method and the `useSession()` hook together - the hook can be pre-populated with the session object from the server side call, so that it is avalible immediately when the page is loaded, and updated client side when the page is viewed in the browser.

You can also call `NextAuth.session()` function in client side JavaScript, without needing to pass a `req` object (it is only needed when calling the function from `getServerSideProps` or `getInitialProps`).

Authentication between the client and server is handled securely, using an HTTP only cookie for the session ID.

**Important! The API for 2.0 is subject to change before release.**

#### Configuration

Configuration options are passed to NextAuth when initalizing it (in your `/api/` route).

The only things you will probably need to configure are your site name (e.g. 'http://www.example.com'), which should be set explicitly for security reasons, a list of authentication services (Twitter, Facebook, Google, etc) and a database adapter.

An "*Adapter*" in NextAuth is a object connects to whatever system you want to use to store data for user accounts, sessions, etc.

NextAuth comes with a default adapter that uses [TypeORM](https://typeorm.io/) so that it can be be used with many different databases without any configuration, you simply add the database driver you want to use to your project and tell NextAuth to use it.

You can define database configuration (including any credentials) using environment variables. Alternatively, you can create a file called `ormconfig.json` at the top level of your project with your configuration, or you can pass a configuration object to the `Adapters.Default()` function. Refer to the [TypeORM configuration documentation](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) for details.

An example `ormconfig.json` configuration for SQL Lite (useful for development and testing):

```json
{
  "type": "sqlite",
  "database": "test"
}
```

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

Appropriate tables / collections for Users, Sessions (etc) will be created automatically. You can customize, extend or replace the models by passing additional options to the `Adapters.Default()` function.

If you are using a database that is not supported out of the box - or if you want to use NextAuth with an existing database - you can pass your own methods to be called for user creation / deletion (etc). This works in a similar way to NextAuth 1.x, but is easier to do.

### Client

NextAuth Client usage remains almost identical, but is much simpler than in version 1.x. Thanks to a new build process, the client library in NextAuth 2.0 is extremely lightweight.

It can be used with React Hooks as well as React lifescycle and Next.js methods for both client and server side rendering, supporting both Single Page Applications and websites that support authentication but are entirely server side rendered (without any dependancy on client side JavaScript).

## Customization

NextAuth now auto-generates simple, unbranded authentication pages for handling Sign in, Email Verification, callbacks, etc.

These are generated automatically with the appropriate sign in options based on the supplied configuration, but you can still create custom authentication pages if you would like to customize the experience.

*This documentation will be updated closer to release.*