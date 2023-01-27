---
id: client
title: Utilities
---

The Auth.js client library makes it easy to interact with sessions from React applications.

#### Example Session Object

```ts
{
  user: {
    name: string
    email: string
    image: string
  },
  expires: Date // This is the expiry of the session, not any of the tokens within the session
}
```

:::tip
The session data returned to the client does not contain sensitive information such as the Session Token or OAuth tokens. It contains a minimal payload that includes enough data needed to display information on a page about the user who is signed in for presentation purposes (e.g name, email, image).

You can use the [session callback](/reference/configuration/auth-config#callbacks) to customize the session object returned to the client if you need to return additional data in the session object.
:::

:::note
The `expires` value is rotated, meaning whenever the session is retrieved from the [REST API](/reference/rest-api), this value will be updated as well, to avoid session expiry.
:::

## getSession()

- Client Side: **Yes**
- Server Side: **No** (See: [`unstable_getServerSession()`](/reference/nextjs/#unstable_getserversession)

Auth.js provides a `getSession()` helper which should be called **client side only** to return the current active session.

On the server side, **this is still available to use**, however, we recommend using `unstable_getServerSession` going forward. The idea behind this is to avoid an additional unnecessary `fetch` call on the server side. For more information, please check out [this issue](https://github.com/nextauthjs/next-auth/issues/1535).

:::note
The `unstable_getServerSession` only has the prefix `unstable_` at the moment, because the API may change in the future. There are no known bugs at the moment and it is safe to use. If you discover any issues, please do report them as a [GitHub Issue](https://github.com/nextauthjs/next-auth/issues) and we will patch them as soon as possible.
:::

This helper is helpful in case you want to read the session outside of the context of React.

When called, `getSession()` will send a request to `/api/auth/session` and returns a promise with a [session object](https://github.com/nextauthjs/next-auth/blob/main/packages/next-auth/src/core/types.ts#L407-L425), or `null` if no session exists.

```js
async function myFunction() {
  const session = await getSession()
  /* ... */
}
```

Read the tutorial [securing pages and API routes](/guides/basics/securing-pages-and-api-routes) to know how to fetch the session in server side calls using `unstable_getServerSession()`.

---

## getCsrfToken()

- Client Side: **Yes**
- Server Side: **Yes**

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
import { getCsrfToken } from "next-auth/react"

export default async (req, res) => {
  const csrfToken = await getCsrfToken({ req })
  /* ... */
  res.end()
}
```

---

## getProviders()

- Client Side: **Yes**
- Server Side: **Yes**

The `getProviders()` method returns the list of providers currently configured for sign in.

It calls `/api/auth/providers` and returns a list of the currently configured authentication providers.

It can be useful if you are creating a dynamic custom sign in page.

---

#### API Route

```jsx title="pages/api/example.js"
import { getProviders } from "next-auth/react"

export default async (req, res) => {
  const providers = await getProviders()
  console.log("Providers", providers)
  res.end()
}
```

:::note
Unlike and `getCsrfToken()`, when calling `getProviders()` server side, you don't need to pass anything, just as calling it client side.
:::

---

## signIn()

- Client Side: **Yes**
- Server Side: No

Using the `signIn()` method ensures the user ends back on the page they started on after completing a sign in flow. It will also handle CSRF Tokens for you automatically when signing in with email.

The `signIn()` method can be called from the client in different ways, as shown below.

### Redirects to sign in page when clicked

```js
import { signIn } from "next-auth/react"

export default () => <button onClick={() => signIn()}>Sign in</button>
```

### Starts OAuth sign-in flow when clicked

By default, when calling the `signIn()` method with no arguments, you will be redirected to the Auth.js sign-in page. If you want to skip that and get redirected to your provider's page immediately, call the `signIn()` method with the provider's `id`.

For example to sign in with Google:

```js
import { signIn } from "next-auth/react"

export default () => (
  <button onClick={() => signIn("google")}>Sign in with Google</button>
)
```

### Starts Email sign-in flow when clicked

When using it with the email flow, pass the target `email` as an option.

```js
import { signIn } from "next-auth/react"

export default ({ email }) => (
  <button onClick={() => signIn("email", { email })}>Sign in with Email</button>
)
```

### Specifying a `callbackUrl`

The `callbackUrl` specifies to which URL the user will be redirected after signing in. Defaults to the page URL the sign-in is initiated from.

You can specify a different `callbackUrl` by specifying it as the second argument of `signIn()`. This works for all providers.

e.g.

- `signIn(undefined, { callbackUrl: '/foo' })`
- `signIn('google', { callbackUrl: 'http://localhost:3000/bar' })`
- `signIn('email', { email, callbackUrl: 'http://localhost:3000/foo' })`

The URL must be considered valid by the [redirect callback handler](/reference/configuration/auth-config#callbacks). By default it requires the URL to be an absolute URL at the same host name, or a relative url starting with a slash. If it does not match it will redirect to the homepage. You can define your own [redirect callback](/guides/basics/callbacks#redirect-callback) to allow other URLs.

### Using the `redirect: false` option

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

### Additional parameters

It is also possible to pass additional parameters to the `/authorize` endpoint through the third argument of `signIn()`.

See the [Authorization Request OIDC spec](https://openid.net/specs/openid-connect-core-1_0.html#AuthRequest) for some ideas. (These are not the only possible ones, all parameters will be forwarded)

e.g.

- `signIn("identity-server4", null, { prompt: "login" })` _always ask the user to re-authenticate_
- `signIn("auth0", null, { login_hint: "info@example.com" })` _hints the e-mail address to the provider_

:::note
You can also set these parameters through [`provider.authorizationParams`](/reference/providers/oauth).
:::

:::note
The following parameters are always overridden server-side: `redirect_uri`, `state`
:::

---

## signOut()

- Client Side: **Yes**
- Server Side: No

In order to logout, use the `signOut()` method to ensure the user ends back on the page they started on after completing the sign out flow. It also handles CSRF tokens for you automatically.

It reloads the page in the browser when complete.

```js
import { signOut } from "next-auth/react"

export default () => <button onClick={() => signOut()}>Sign out</button>
```

### Specifying a `callbackUrl`

As with the `signIn()` function, you can specify a `callbackUrl` parameter by passing it as an option.

e.g. `signOut({ callbackUrl: 'http://localhost:3000/foo' })`

The URL must be considered valid by the [redirect callback handler](/guides/basics/callbacks#redirect-callback). By default, it requires the URL to be an absolute URL at the same host name, or you can also supply a relative URL starting with a slash. If it does not match it will redirect to the homepage. You can define your own [redirect callback](/guides/basics/callbacks#redirect-callback) to allow other URLs.

### Using the `redirect: false` option

If you pass `redirect: false` to `signOut`, the page will not reload. The session will be deleted, and the `useSession` hook is notified, so any indication about the user will be shown as logged out automatically. It can give a very nice experience for the user.

:::tip
If you need to redirect to another page but you want to avoid a page reload, you can try:
`const data = await signOut({redirect: false, callbackUrl: "/foo"})`
where `data.url` is the validated URL you can redirect the user to without any flicker by using Next.js's `useRouter().push(data.url)`
:::
