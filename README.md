# NextAuth

## About NextAuth

This is work in progress of version 2.0 of [NextAuth](https://github.com/iaincollins/next-auth/), an authentication library for Next.js.

**Version 2.0 is a complete re-write, designed from the ground up for serverless.**

* Built for serverless - unlike version 1.x it doesn't depend on Express or PassportJS (but is compatible with them) and is designed to support automatic code splitting at build time for optimal bundle size and performance.
* Supports the same oAuth 1.x and oAuth 2.x and email authentication flows as version 1.x (both client and server side).
* Simple configuration with out-of-the-box support for common oAuth providers and databases.

If you are familar with version 1.x you will appreciate the much simpler and hassle free configuration, especially for provider configuration, database adapters and much improved Cross Site Request Forgery token handling (now enabled by default *for next-auth routes only*).

Additional options and planned features will be announced closer to release.

Note: NextAuth is not associated with Next.js or Vercel.

## Configuration

To add `next-auth` to a project, create a file to handle authentication requests at `pages/api/auth/[...slug.js]` with a list of authentication providers (e.g. Twitter, Facebook, Google, GitHub, etc) and your database (e.g. MongoDB, MySQL, Elasticsearch, etc).

All requests to `pages/api/auth/*` (signin, callback, signout) will be automatically handed by NextAuth.

Example `pages/api/auth/[...slug.js]`:

```javascript
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import Adapters from 'next-auth/adapters'
import MongoClient from 'mongodb'

const options = {
  site: 'https://www.example.com',
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
  adapter: Adapters.MongoDB(MongoClient, process.env.MONGODB)
}

export default (req, res) => NextAuth(req, res, options)
```

NextAuth Client usage remains almost identical, but is much simpler than in version 1.x.

You can still create your own custom authentication pages, but if you want to you will now be able to just link to `/api/auth/signin` to use the built-in authentication pages, which are generated automatically based on the supplied configuration options.

*Additional documentation coming soon!*


