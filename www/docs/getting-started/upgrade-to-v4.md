---
id: upgrade-v4
title: Upgrade Guide (v4)
---

NextAuth.js version 4.0 included a few breaking changes from the last major version (3.0). So we're here to help you upgrade your applications as smoothly as possible. It should be possible to upgrade from any version of 3.x to the latest 4.0 release by following the next few migration steps.

### 1. Database Adapters

If you use the built-in TypeORM or Prisma adapters, these have been removed from the core `next-auth` package to not balloon the package size for users who do not need a database. Thankfully the migration is super easy; you just need to install the external packages for your database now and change your `[...nextauth].js` config file a bit.

```diff
// [...nextauth].js
import NextAuth from "next-auth"
+ import TypeORMAdapter from "@next-auth/typeorm-legacy-adapter"

...
export default NextAuth({
-  database: "yourconnectionstring",
+  adapter: TypeORMAdapter("yourconnectionstring")
})
```

See [nextauthjs/adapter](https://github.com/nextauthjs/adapters) for more details.

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.8

### 2. next-auth/react

We've renamed the clientside import source to `next-auth/react`. To comply with this change, you will simply have to rename anywhere you were using `next-auth/client`.

For example:

```diff
- import { useSession } from "next-auth/client"
+ import { useSession } from "next-auth/react"
```

We've also made the following changes to the names of the exports:

- `setOptions`: Not exposed anymore, use [`SessionProvider` props](https://next-auth.js.org/getting-started/client#options)
- `options`: Not exposed anymore, [use `SessionProvider` props](https://next-auth.js.org/getting-started/client#options)
- `session`: Renamed to `getSession`
- `providers`: Renamed to `getProviders`
- `csrfToken`: Renamed to `getCsrfToken`
- `signin`: Renamed to `signIn`
- `signout`: Renamed to `signOut`
- `Provider`: Renamed to `SessionProvider`

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.12

### 3. SessionProvider

Version 4.0 makes using the `SessionProvider` mandatory. This means that you will have to wrap any part of your application using `useSession` in this provider, if you were not doing so already. The `SessionProvider` has also undergone a few further changes:

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

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.12

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

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.17

### 5. useSession Hook

The `useSession` hook has been updated to return an object. This allows you to test states much more cleanly with the new `status` option.

```diff
- const [ session, loading ] = useSession()
+ const { data: session, status } = useSession()
+ const loading = status === "loading"
```

[Check the docs](https://next-auth.js.org/getting-started/client#usesession) for the possible values of both `session.status` and `session.data`.

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.18

### 6. nodemailer

[`nodemailer`](https://npmjs.com/package/nodemailer) is no longer a dependency and added by default. If you are using the Email provider you can install it in your project manually, or use any other Email library in the [`sendVerificationRequest`](/configuration/providers#options-1#:~:text=sendVerificationRequest) callback.

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.2

### 7. Logger API

The logger API has been simplified to use at most two parameters, where the second is usually an object (`metadata`) containing an `error` object. If you are not using the logger settings you can ignore this change.

```diff
// [...nextauth.js]
import log from "some-logger-service"
...
logger: {
- error(code, ...message) {},
+ error(code, metadata) {},
- warn(code, ...message) {},
+ warn(code) {}
- debug(code, ...message) {}
+ debug(code, metadata) {}
}
```

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.19

### 8. Events

Two event signatures changes to also use the named parameters pattern, `signOut` and `updateUser`.

```diff
// [...nextauth].js
...
events: {
- signOut(tokenOrSession),
+ signOut({ token, session }), // token if using JWT, session if DB persisted sessions.
- updateUser(user)
+ updateUser({ user })
}
```

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.20

### 9. Providers

All OAuth providers' `profile` callback are expected to only return these fields by default from now on: `id`, `name`, `email`, and `image` at most. If any of these are missing values, they should be set to `null`.

The following new options are available:

1. `authorization` (replaces `authorizationUrl`, `authorizationParams`, `scope`)
2. `token` replaces (`accessTokenUrl`, `headers`, `params`)
3. `userinfo` (replaces `profileUrl`)

For more information on how to use these new options, please checkout the full release notes below.

Also the `AzureADB2C` provider has been renamed `AzureAD`.

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.20

## Summary

We hope this migration goes smoothly for each and every one of you! If you have any questions or get stuck anywhere, feel free to create [a new issue](https://github.com/nextauthjs/next-auth/issues/new) on GitHub.
