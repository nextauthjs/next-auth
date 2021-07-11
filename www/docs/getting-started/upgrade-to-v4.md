---
id: upgrade-v4
title: Upgrade Guide (v4)
---

NextAuth.js version 4.0 included a few breaking changes from the last major version (3.0). So we're here to help you upgrade your applications as smoothly as possible. It should be possible to upgrade from any version of 3.x to the latest 4.0 release by following the next few migration steps.

### 1. Database Adapters

If you are using the built-in TypeORM or Prisma adapters, these have been removed from the core `next-auth` package so as to not balloon the package size for users who do not need a database. Thankfully the migration is super easy, you just need to install the external packages for your database now and adapt your `[...nextauth].js` config file a bit.

```diff
// [...nextauth].js
import NextAuth from "next-auth"
- import Adapters from "next-auth/adapters"
+ import TypeORMAdapter from "@next-auth/typeorm-legacy-adapter"

...
export default NextAuth({
-  database: Adapters.TypeORM.Adapter(...),
+  adapter: TypeORMAdapter("yourconnectionstring")
})
```

See [nextauthjs/adapter](https://github.com/nextauthjs/adapters) for more details.

### 2. next-auth/react

We've renamed the clientside import source to `next-auth/react`. To comply with this change, you will simply have to rename anywhere you were using `next-auth/client`.

For example:

```diff
- import { useSession } from "next-auth/client"
+ import { useSession } from "next-auth/react"
```

We've also made the following changes to the names of the exports:

- `setOptions`: Not exposed anymore, use `SessionProvider` props
- `options`: Not exposed anymore, use `SessionProvider` props
- `session`: Rename to `getSession`
- `providers`: Rename to `getProviders`
- `csrfToken`: Rename to `getCsrfToken`
- `signin`: Rename to `signIn`
- `signout`: Rename to `signOut`
- `Provider`: Rename to `SessionProvider`

### 3. SessionProvider

Version 4.0 makes using the `SessionProvider` mandatory. This means that you will have to wrap your application in a provider, if you were not doing so already. The `SessionProvider` has also undergone a few further changes:

- `Provider` is renamed to `SessionProvider`
- The options prop is now flattened as the props of SessionProvider.
- `clientMaxAge` has been renamed to `staleTime`.
- `keepAlive` has been renamed to `refetchInterval`.

The best practice for wrapping your app in Providers is to do so in your `pages/_app.jsx` file.

An example use-case with these new changes:

```jsx
import { SessionProvider } from "next-auth/react"

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    // `session` comes from `getServerSideProps` or `getInitialProps`.
    // Avoids flickering/session loading on first load.
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}
```

### 4. Named Parameters

We have changed the arguments to our callbacks to the named parameters pattern. This way you don't have to use dummy `_` placeholders or other tricks.

The signatures for the callback methods now look like this:

```diff
- signIn(user, account, profileOrEmailOrCredentials)
+ signIn({ user, account, profile, email, credentials })
```

```diff
- redirect(url, baseUrl)
+ redirect({ url, baseUrl })
```

```diff
- session(session, tokenOrUser)
+ session({ session, token, user })
```

```diff
- jwt(token, user, account, OAuthProfile, isNewUser)
+ jwt({ token, user, account, profile, isNewUser })
```

### 5. useSession Hook

The `useSession` hook has been updated to return an object. This allows you to test states much more cleanly with the new `status` option.

```diff
- const [ session, loading ] = useSession()
+ const { data: session, status } = useSession()
+ const loading = status === "loading"
```

## Summary

We hope this migration goes smoothly for each and every one of you! If you have any questions or get stuck anywhere, feel free to create [a new issue](https://github.com/nextauthjs/next-auth/issues/new) on GitHub.
