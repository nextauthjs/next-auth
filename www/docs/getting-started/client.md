---
id: client
title: Client API
---

The NextAuth.js client library makes it easy to interact with sessions from React applications.

#### Example Session Object

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

:::tip
The session data returned to the client does not contain sensitive information such as the Session Token or OAuth tokens. It contains a minimal payload that includes enough data needed to display information on a page about the user who is signed in for presentation purposes (e.g name, email, image).

You can use the [session callback](/configuration/callbacks#session) to customize the session object returned to the client if you need to return additional data in the session object.
:::

---

## useSession()

* Client Side: **Yes**
* Server Side: No

The `useSession()` React Hook in the NextAuth.js client is the easiest way to check if someone is signed in.

It works best when the [`<Provider>`](#provider) is added to `pages/_app.js`.

#### Example

```jsx
import { useSession } from 'next-auth/client'

export default function Component() {
  const [ session, loading ] = useSession()

  if(session) {
    return <p>Signed in as {session.user.email}</p>
  }

  return <a href="/api/auth/signin">Sign in</a>
}
```

---

## getSession()

* Client Side: **Yes**
* Server Side: **Yes**

NextAuth.js provides a `getSession()` method which can be called client or server side to return a session.

It calls `/api/auth/session` and returns a promise with a session object, or null if no session exists.

#### Client Side Example

```js
async function myFunction() {
  const session = await getSession()
  /* ... */
}
```

#### Server Side Example

```js
import { getSession } from 'next-auth/client'

export default async (req, res) => {
  const session = await getSession({ req })
  /* ... */
  res.end()
}
```

:::note
When calling `getSession()` server side, you need to pass `{req}` or `context` object.
:::

The tutorial [securing pages and API routes](/tutorials/securing-pages-and-api-routes) shows how to use `getSession()` in server side calls.

---

## getCsrfToken()

* Client Side: **Yes**
* Server Side: **Yes**

The `getCsrfToken()` method returns the current Cross Site Request Forgery Token (CSRF Token) required to make POST requests (e.g. for signing in and signing out).

You likely only need to use this if you are not using the built-in `signIn()` and `signOut()` methods.

#### Client Side Example

```js
async function myFunction() {
  const csrfToken = await getCsrfToken()
  /* ... */
}
```

#### Server Side Example

```js
import { getCsrfToken } from 'next-auth/client'

export default async (req, res) => {
  const csrfToken = await getCsrfToken({ req })
  /* ... */
  res.end()
}
```

---

## getProviders()

* Client Side: **Yes**
* Server Side: **Yes**

The `getProviders()` method returns the list of providers currently configured for sign in.

It calls `/api/auth/providers` and returns a list of the currently configured authentication providers.

It can be useful if you are creating a dynamic custom sign in page.

---

#### API Route

```jsx title="pages/api/example.js"
import { getProviders } from 'next-auth/client'

export default async (req, res) => {
  const providers = await getProviders()
  console.log('Providers', providers)
  res.end()
}
```

:::note
Unlike `getSession()` and `getCsrfToken()`, when calling `getProviders()` server side, you don't need to pass anything, just as calling it client side.
:::

---

## signIn()

* Client Side: **Yes**
* Server Side: No

Using the `signIn()` method ensures the user ends back on the page they started on after completing a sign in flow. It will also handle CSRF Tokens for you automatically when signing in with email.

The `signIn()` method can be called from the client in different ways, as shown below.

#### Redirects to sign in page when clicked

```js
import { signIn } from 'next-auth/client'

export default () => (
  <button onClick={() => signIn()}>Sign in</button>
)
```

#### Starts Google OAuth sign-in flow when clicked

```js
import { signIn } from 'next-auth/client'

export default () => (
  <button onClick={() => signIn('google')}>Sign in with Google</button>
)
```

#### Starts Email sign-in flow when clicked

When using it with the email flow, pass the target `email` as an option.

```js
import { signIn } from 'next-auth/client'

export default ({ email }) => (
  <button onClick={() => signIn('email', { email })}>Sign in with Email</button>
)
```

#### Specifying a callbackUrl

The `callbackUrl` specifies to which URL the user will be redirected after signing in. It defaults to the current URL of a user.

You can specify a different `callbackUrl` by specifying it as the second argument of `signIn()`. This works for all providers.

e.g.

* `signIn(null, { callbackUrl: 'http://localhost:3000/foo' })`
* `signIn('google', { callbackUrl: 'http://localhost:3000/foo' })`
* `signIn('email', { email, callbackUrl: 'http://localhost:3000/foo' })`

The URL must be considered valid by the [redirect callback handler](/configuration/callbacks#redirect). By default it requires the URL to be an absolute URL at the same hostname, or else it will redirect to the homepage. You can define your own redirect callback to allow other URLs, including supporting relative URLs.

#### Using the redirect: false option

:::note
The redirect option is only available for `credentials` and `email` providers.
:::

In some cases, you might want to deal with the sign in response on the same page and disable the default redirection. For example, if an error occurs (like wrong credentials given by the user), you might want to handle the error on the same page. For that, you can pass `redirect: false` in the second parameter object.

e.g.

- `signIn('credentials', { redirect: false, password: 'password' })`
- `signIn('email', { redirect: false, email: 'bill@fillmurray.com' })`

`signIn` will then return a Promise, that resolves to the following:

```ts
{
  /**
   * Will be different error codes,
   * depending on the type of error.
   */
  error: string | undefined
  /**
   * HTTP status code,
   * hints the kind of error that happened. 
   */ 
  status: number
  /**
   * `true` if the signin was successful
   */
  ok: boolean
  /**
   * `null` if there was an error,
   * otherwise the url the user
   * should have been redirected to.
   */
  url: string | null
}
```

#### Additional params

It is also possible to pass additional parameters to the `/authorize` endpoint through the third argument of `signIn()`.

See the [Authorization Request OIDC spec](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) for some ideas. (These are not the only possible ones, all parameters will be forwarded)

e.g.

* `signIn("identity-server4", null, { prompt: "login" })` *always ask the user to reauthenticate*
* `signIn("auth0", null, { login_hint: "info@example.com" })` *hints the e-mail address to the provider*

:::note
You can also set these parameters through [`provider.authorizationParams`](/configuration/providers#oauth-provider-options).
:::

:::note
The following parameters are always overridden server-side: `redirect_uri`, `scope`, `state`
:::

---

## signOut()

* Client Side: **Yes**
* Server Side: No

Using the `signOut()` method ensures the user ends back on the page they started on after completing the sign out flow. It also handles CSRF tokens for you automatically.

It reloads the page in the browser when complete.

```js
import { signOut } from 'next-auth/client'

export default () => (
  <button onClick={() => signOut()}>Sign out</button>
)
```

#### Specifying a callbackUrl

As with the `signIn()` function, you can specify a `callbackUrl` parameter by passing it as an option.

e.g. `signOut({ callbackUrl: 'http://localhost:3000/foo' })`

The URL must be considered valid by the [redirect callback handler](/configuration/callbacks#redirect). By default this means it must be an absolute URL at the same hostname (or else it will default to the homepage); you can define your own custom redirect callback to allow other URLs, including supporting relative URLs.

#### Using the redirect: false option

If you pass `redirect: false` to `signOut`, the page will not reload. The session will be deleted, and the `useSession` hook is notified, so any indication about the user will be shown as logged out automatically. It can give a very nice experience for the user.

:::tip
If you need to redirect to another page but you want to avoid a page reload, you can try:
`const data = await signOut({redirect: false, callbackUrl: "/foo"})`
where `data.url` is the validated url you can redirect the user to without any flicker by using Next.js's `useRouter().push(data.url)`
:::

---

## Provider

Using the supplied React `<Provider>` allows instances of `useSession()` to share the session object across components, by using [React Context](https://reactjs.org/docs/context.html) under the hood.

This improves performance, reduces network calls and avoids page flicker when rendering. It is highly recommended and can be easily added to all pages in Next.js apps by using `pages/_app.js`.

```jsx title="pages/_app.js"
import { Provider } from 'next-auth/client'

export default function App ({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  )
}
```

If you pass the `session` page prop to the `<Provider>` – as in the example above – you can avoid checking the session twice on pages that support both server and client side rendering.

### Options

The session state is automatically synchronized across all open tabs/windows and they are all updated whenever they gain or lose focus or the state changes in any of them (e.g. a user signs in or out).

If you have session expiry times of 30 days (the default) or more then you probably don't need to change any of the default options in the Provider. If you need to, you can can trigger an update of the session object across all tabs/windows by calling `getSession()` from a client side function.

However, if you need to customise the session behaviour and/or are using short session expiry times, you can pass options to the provider to customise the behaviour of the `useSession()` hook.

```jsx title="pages/_app.js"
import { Provider } from 'next-auth/client'

export default function App ({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}
      options={{ 
        clientMaxAge: 60     // Re-fetch session if cache is older than 60 seconds
        keepAlive:    5 * 60 // Send keepAlive message every 5 minutes
      }}
      >
      <Component {...pageProps} />
    </Provider>
  )
}
```

:::note
**These options have no effect on clients that are not signed in.**

Every tab/window maintains it's own copy of the local session state; the session it is not stored in shared storage like localStorage or sessionStorage. Any update in one tab/window triggers a message to other tabs/windows to update their own session state.

Using low values for `clientMaxAge` or `keepAlive` will increase network traffic and load on  authenticated clients and may impact hosting costs and performance.
:::

#### Client Max Age

The `clientMaxAge` option is the maximum age a session data can be on the client before it is considered stale.

When `clientMaxAge` is set to `0` (the default) the cache will always be used when useSession is called and only explicit calls made to get the session status (i.e. `getSession()`) or event triggers, such as signing in or out in another tab/window, or a tab/window gaining or losing focus, will trigger an update of the session state.

If set to any value other than zero, it specifies in seconds the maxium age of session data on the client before the `useSession()` hook will call the server again to sync the session state.

Unless you have a short session expiry time (e.g. < 24 hours) you probably don't need to change this option. Setting this option to too short a value will increase load (and potentially hosting costs).

The value for `clientMaxAge` should always be lower than the value of the session `maxAge` option.

#### Keep Alive

The `keepAlive` option is how often the client should contact the server to avoid a session expiring.

When `keepAlive` is set to `0` (the default) it will not send a keep alive message.

If set to any value other than zero, it specifies in seconds how often the client should contact the server to update the session state. If the session state has expired when it is triggered, all open tabs/windows will be updated to reflect this.

The value for `keepAlive` should always be lower than the value of the session `maxAge` option.

:::note
See [**the Next.js documentation**](https://nextjs.org/docs/advanced-features/custom-app) for more information on **_app.js** in Next.js applications.
:::
