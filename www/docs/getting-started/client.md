---
id: client
title: Client API
---

The NextAuth.js client library makes it easy to interact with sessions from React applications.

Some of the methods can be called both client side and server side.

:::note
When using any of the client API methods server side, [context](https://nextjs.org/docs/api-reference/data-fetching/getInitialProps#context-object) must be passed as an argument. The documentation for **getSession()** has an example.
:::

## useSession()

* Client Side: **Yes**
* Server Side: No

The `useSession()` React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.

It works best when used with NextAuth.js `<Provider>` is added to `pages/_app.js` (see [provider](#provider)).

```jsx
import NextAuth from 'next-auth/client'

export default () => {
  const [ session, loading ] = NextAuth.useSession()

  return <>
    {session && <p>Signed in as {session.user.email}</p>}
    {!session && <p><a href="/api/auth/signin">Sign in</p>}
  </>
}
```

---

## getSession()

* Client Side: **Yes**
* Server Side: **Yes**

NextAuth.js also provides a `getSession()` method which can be called client or server side to return a session.
 
It calls `/api/auth/session` and returns a promise with a session object, or null if no session exists.

A session object looks like this:

```js
{
  user: {
    name: string,
    email: string,
    image: uri
  },
  accessToken: string,
  expires: "YYYY-MM-DDTHH:mm:ss.SSSZ"
}
```

You can call `getSession()` inside a function to check if a user is signed in, or use it for server side rendered pages that supporting signing in without requiring client side JavaScript.

:::info
Note that because it exposed to the client it does not contain sensitive information such as the Session Token or OAuth service related tokens. It includes enough information (e.g name, email) to display information on a page about the user who is signed in, and an Access Token that can be used to identify the session without exposing the Session Token itself.
:::

Because it is a Universal method, you can use `getSession()` in both client and server side functions, such as `getInitialProps()` in Next.js:

```jsx title="/pages/index.js"
import { session } from 'next-auth/client'

const Page = ({ session }) => (<p>
    {!session && <>
      Not signed in <br/>
      <a href="/api/auth/signin">Sign in</a>
    </>}
    {session && <>
      Signed in as {session.user.email} <br/>
      <a href="/api/auth/signout">Sign out</a>
    </>}
  </p>)

Page.getInitialProps = async (context) => {
  return {
    session: await getSession(context)
  }
}

export default Page
```

#### Using getSession() in API routes

You can also get the session object in Next.js API routes:
 
```js
import { session } from 'next-auth/client'

export default (req, res) => {
  const session = await getSession({ req })

  if (session) {
    // Signed in
    const { accessToken } = session.user

    // Do something with accessToken (e.g. look up user in DB)

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ /* data */ }))
  } else {
    // Not signed in
    res.status(302).setHeader('Location', pages.newUser)
    res.end()
  }
}

```

:::note
When calling `getSession()` server side, you must pass the request object - e.g. `getSession({req})` - or you can the pass entire `context` object as it contains the `req` object.
:::

---

## getProviders()

* Client Side: **Yes**
* Server Side: **Yes**

The `getProviders()` method returns the list of providers currently configured for sign in.

It calls `/api/auth/providers` and returns a with a list of the currently configured authentication providers.

It can be use useful if you are creating a dynamic custom sign in page.

---

## getCsrfToken()

* Client Side: **Yes**
* Server Side: **Yes**

The `getCsrfToken()` method returns the current Cross Site Request Forgery (CSRF Token) required to make POST requests (e.g. for signing in and signing out). It calls `/api/auth/csrf`.

You likely only need to use this if you are not using the built-in `signin()` and `signout()` methods.

---

## signin()

* Client Side: **Yes**
* Server Side: No

Using the `signin()` method ensures the user ends back on the page they started on after completing a sign in flow. It will also handle CSRF tokens for you automatically when signing in with email.

The `signin()` method can be called from the client in different ways, as shown below.

#### Redirects to sign in page when clicked

```js
import { signin } from 'next-auth/client'

export default () => (
  <button onClick={signin}>Sign in</button>
)
```

#### Starts Google OAuth sign-in flow when clicked

```js
import { signin } from 'next-auth/client'

export default () => (
  <button onClick={() => signin('google')}>Sign in with Google</button>
)
```

#### Starts Email sign-in flow when clicked

When using it with the email flow, pass the target `email` as an option.

```js
import { signin } from 'next-auth/client'

export default ({ email }) => (
  <button onClick={() => signin('email', { email })}>Sign in with Email</button>
)
```

:::tip
To also support signing in from clients that do not have client side JavaScript, use a regular link, add an onClick handler to it and call **e.preventDefault()** before calling the **signin()** method.
:::

---

## signout()

* Client Side: **Yes**
* Server Side: No

Using the `signout()` method ensures the user ends back on the page they started on after completing the sign out flow. It also handles CSRF tokens for you automatically.

It reloads the page in the browser when complete.

```js
import { signout } from 'next-auth/client'

export default () => (
  <button onClick={signout}>Sign out</button>
)
```

---

## Provider

Using the supplied React `<Provider>` allows instances of `useSession()` to share the session object across components, buy using [React Context](https://reactjs.org/docs/context.html) under the hood.

This improves performance, reduces network calls and avoids page flicker when rendering.

It is highly recommended and can be easily added to all pages in Next.js apps by using `/pages/_app.js`.
 
```jsx title="/pages/_app.js"
import { Provider } from 'next-auth/client'

export default ({ Component, pageProps }) => {
  const { session } = pageProps
  return (
    <Provider session={session}>
      <Component {...pageProps} />
    </Provider>
  )
}
```

If you pass the `session` page prop to the `<Provider>` – as in the example above – you can avoid checking the session twice on pages that support both server and client side rendering.

:::note
See [**the Next.js documentation**](https://nextjs.org/docs/advanced-features/custom-app) for more information on **_app.js** in Next.js applications.
:::
