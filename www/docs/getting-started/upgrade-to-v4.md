---
id: upgrade-v4
title: Upgrade Guide (v4)
---

NextAuth.js version 4 included a few breaking changes from the last major version (3.x). So we're here to help you upgrade your applications as smoothly as possible. It should be possible to upgrade from any version of 3.x to the latest 4 release by following the next few migration steps.

### 1. Database Adapters

You can find the official Adapters in the [nextauthjs/adapter](https://github.com/nextauthjs/adapters) repository. Although you can still [create your own](/tutorials/creating-a-database-adapter) with a new, [simplified Adapter API](https://github.com/nextauthjs/next-auth/pull/2361).

1.1. If you use the built-in TypeORM or Prisma adapters, these have been removed from the core `next-auth` package to not balloon the package size for users who do not need a database. Thankfully the migration is super easy; you just need to install the external packages for your database and change the import in your `[...nextauth].js`. 

The `database` option is gone, you can do the following instead:

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

1.2. The `prisma-legacy` adapter has been removed, please use the [`@next-auth/prisma-adapter`](https:/npmjs.com/package/@next-auth/prisma-adapter) instead.

1.3. The `typeorm-legacy` adapter will stay as-is for the time being, however we do aim to migrate this to individual lighter weight adapters for each database type in the future, or switch out `typeorm`.

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.8 and https://github.com/nextauthjs/next-auth/pull/2361

#### 1.4 Adapter API

The Adapter API has been rewritten and significantly simplified in NextAuth v4. The adapters now have less work to do as some functionality has been migrated to the core of NextAuth, like hashing the [verification token](/adapters/models/#verification-token).

**This does not require any changes from the user**, however if you are an adapter maintainer or are interested in writing your own adapter, you can find more information about this change in https://github.com/nextauthjs/next-auth/pull/2361 and release https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.22.

### 2. `next-auth/react`

We've renamed the client-side import source to `next-auth/react`. To comply with this change, you will simply have to rename anywhere you were using `next-auth/client`.

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

Version 4 makes using the `SessionProvider` mandatory. This means that you will have to wrap any part of your application using `useSession` in this provider, if you were not doing so already. The `SessionProvider` has also undergone a few further changes:

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

### Callbacks

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

### Events

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

### 5. useSession Hook

The `useSession` hook has been updated to return an object. This allows you to test states much more cleanly with the new `status` option.

```diff
- const [ session, loading ] = useSession()
+ const { data: session, status } = useSession()
+ const loading = status === "loading"
```

[Check the docs](https://next-auth.js.org/getting-started/client#usesession) for the possible values of both `session.status` and `session.data`.

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.18

### 6. `nodemailer`

[`nodemailer`](https://npmjs.com/package/nodemailer) is no longer a dependency added by default. If you are using the Email provider you can install it in your project manually, or use any other Email library in the [`sendVerificationRequest`](/configuration/providers#options-1#:~:text=sendVerificationRequest) callback. This reduces bundle size for those not actually using the Email provider.

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

### 8. Providers

Importing OAuth providers has changed a bit, they now need to be individually imported.

```diff
- import Provider from "next-auth/providers"
- Providers.Auth0({...})
+ import Auth0Provider from "next-auth/providers/auth0"
+ Auth0Provider({...})
```

> 1. The `AzureADB2C` provider has been renamed `AzureAD`.
> 2. The `Basecamp` provider has been removed, see explanation [here](https://github.com/basecamp/api/blob/master/sections/authentication.md#on-authenticating-users-via-oauth).
> 3. The GitHub provider by default now will not request full write access to user profiles. If you need this scope, please add `user` to the scope option manually.

The following new options are available when defining your Providers in the configuration:

1. `authorization` (replaces `authorizationUrl`, `authorizationParams`, `scope`)
2. `token` replaces (`accessTokenUrl`, `headers`, `params`)
3. `userinfo` (replaces `profileUrl`)

Read more about it in this PR: (next-auth#2411)[https://github.com/nextauthjs/next-auth/pull/2411#issue-693918157]

When submitting a new OAuth provider to the repository, the `profile` callback is expected to only return these fields from now on: `id`, `name`, `email`, and `image`. If any of these are missing values, they should be set to `null`.

Also worth noting that the `id` is expected to be returned as a `string` type (For example if your provider returns it as a number, you can simply cast it by the `.toString()` method). This makes the returned profile comply across providers/accounts/adapters, and will hopefully cause less confusion.

Introduced in https://github.com/nextauthjs/next-auth/releases/tag/v4.0.0-next.20

## Summary

We hope this migration goes smoothly for each and every one of you! If you have any questions or get stuck anywhere, feel free to create [a new issue](https://github.com/nextauthjs/next-auth/issues/new) on GitHub.
