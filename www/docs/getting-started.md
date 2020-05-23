---
id: getting-started
title: Getting Started
---

*This documentation is for next-auth@beta and is not complete. It will be updated closer to release.*

**This is beta software and is not ready for production use!**

## Requirements  

This guide assumes you have new (or existing) Next.js project and have used Next.js before.

* The easiest way to get started is to [clone the example project](https://github.com/iaincollins/next-auth-example)
* Choose one OAuth provider and/or Passwordless email sign in to start with
* You can use NextAuth with both SQL and Document databases out of the box
* Try using it with the sqlite database first

## Server

To add `next-auth` to a project, create a file to handle authentication requests in the `/api` routes folder.

```javascript title="/page/api/auth/[...slug].js"
import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

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
  database: {
    type: 'sqlite',
    database: ':memory:',
    synchronize: true
  }
}

export default (req, res) => NextAuth(req, res, options)
```

All requests to `pages/api/auth/*` (signin, callback, signout, etc) will be handed by NextAuth.

Your can view the callback URLs you need to specify with your OAuth providers at `/api/auth/providers`.

:::important
Your project will need an npm module suitable for your database installed (e.g. `npm install sqlite3`).
:::

## Client 

The `useSession()` hook is the easiest way to check if someone is signed in.

```jsx {5} title="/page/index.js"
import NextAuth from 'next-auth'

export default () => {
  const [ session, loading ] = NextAuth.useSession()

  return <>
    {session && <p>Signed in as {session.user.email}</p>}
    {!session && <p><a href="/api/auth/signin">Sign in</p>}
  </>
}
```

**This is all the code you need to add support for signing in to a project!**

---

## Beyond the basics

### Add Provider to _app.js

While calling `useSession()` like this will work perfectly well, it will do network request to get the session in each component you use it in. To reduce network load and improve performance, you can wrap your component tree in our `Provider`, which will make `useSession()` use [React Context](https://reactjs.org/docs/context.html) instead.

:::tip
* Add the `Provider` to `pages/_app.js` if you want to call `useSession()` from any component
* See [Next.js documentation](https://nextjs.org/docs/advanced-features/custom-app) for more information on `_app.js`
:::

```jsx {5,7} title="/pages/_app.js"
import NextAuth from 'next-auth'

export default ({ Component, pageProps }) => (
  <NextAuth.Provider>
    <Component {...pageProps} />
  </NextAuth.Provider>
)
```

### Universal Rendering

Authentication when Server Side Rendering is also supported with `session()`, which can be called client or server side, so you can create server rendered pages that do not require client side JavaScript.

```jsx {3,10} title="/pages/index.js"
import NextAuth from 'next-auth/client'

const Page = ({ session }) => (<>
  {session && <p>Signed in as {session.user.email}</p>}
  {!session && <p><a href="/api/auth/signin">Sign in</p>}
</>)

Page.getInitialProps = async ({req}) => {
  return {
    session: await NextAuth.session({req})
  }
}

export default Page
```

You can use the `session()` method and the `useSession()` hook together. 

If you are using the `<Provider>` in `_app.js` and export the session as a prop named `session` it will be automatically avalible in `useSession()` when the page loads.

The `req` paramater is needed when calling `NextAuth.session()` during server side rendering (i.e. in either `getServerSideProps` or `getInitialProps`), but is not needed when calling it client side.

