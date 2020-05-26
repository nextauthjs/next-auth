---
id: getting-started
title: Getting Started
---

*This documentation is for next-auth@beta and is not complete. It will be updated closer to release.*

**This is beta software and is not ready for production use!**

## Requirements  

This guide assumes you have new (or existing) Next.js project and have used Next.js before.

* The easiest way to get started is to [clone the example project](https://github.com/iaincollins/next-auth-example)
* Choose an [OAuth provider](/providers) to try out and/or use passwordless email sign in
* A MySQL, Postgress, MongoDB or SQLite database

:::tip
You can create your own providers and use NextAuth.js with any database but to get started it's recommended to stick to one of the included providers and supported databases.
:::

## Server

To add NextAuth.js to a project create a file to handle authentication requests in the `/api` routes folder.

```javascript title="/pages/api/auth/[...slug].js"
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
  database: process.env.DATABASE_URL
}

export default (req, res) => NextAuth(req, res, options)
```

All requests to `pages/api/auth/*` (signin, callback, signout, etc) will be handed by NextAuth.js.

Your can view the callback URLs you need to specify with your OAuth providers at `/api/auth/providers`.

:::important
* You will also need to install the appropraite npm module for your database installed 
* See the [configuration](/configuration) page for more information and examples
:::

## Client 

The `useSession()` hook is the easiest way to check if someone is signed in.

```jsx {5} title="/pages/index.js"
import { useSession } from 'next-auth'

export default () => {
  const [ session, loading ] = useSession()

  return <>
    {session && <p>Signed in as {session.user.email} <a href="/api/auth/signout">Sign out</a></p>}
    {!session && <p><a href="/api/auth/signin">Sign in</a></p>}
  </>
}
```

**This is all the code you need to add support for signing in to a project!**

---

## Beyond the basics

### Add Provider to _app.js

While simply calling `useSession()` will work, it will trigger network request to get the session in each component you use it in.

To reduce network load and improve page speed, you can wrap your component tree in the `Provider`, which uses [React Context](https://reactjs.org/docs/context.html) to share the session object between all instances of `useSession()`.

:::tip
* Add the **Provider** to `pages/_app.js` if you want to call **useSession()** from any component
* See [**the Next.js documentation**](https://nextjs.org/docs/advanced-features/custom-app) for more information on `_app.js`
:::

```jsx {5,7} title="/pages/_app.js"
import { Provider } from 'next-auth'

export default ({ Component, pageProps }) => (
  <Provider>
    <Component {...pageProps} />
  </Provider>
)
```

### Universal Rendering

Authentication when Server Side Rendering is also supported with `session()`, which can be called client or server side, so you can create server rendered pages that do not require client side JavaScript.

```jsx {3,10} title="/pages/index.js"
import { session } from 'next-auth/client'

const Page = ({ session }) => (<>
  {session && <p>Signed in as {session.user.email}</p>}
  {!session && <p><a href="/api/auth/signin">Sign in</p>}
</>)

Page.getInitialProps = async ({req}) => {
  return {
    session: await session({req})
  }
}

export default Page
```

You can use the `session()` method and the `useSession()` hook together. 

If you are using the `<Provider>` in `_app.js` and export the session as a prop named `session`, it can be automatically avalible to `useSession()` when the page loads.

Checkout [next-auth-example.now.sh](https://next-auth-example.now.sh) for a working example.

:::important
The `req` parameter should be passed calling **NextAuth.session()** during server side rendering - i.e. in either **getServerSideProps()** or **getInitialProps()** - but is not needed when calling it client side.
:::
