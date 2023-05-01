---
title: Role-based access control
---

There are two ways to add role-based access control (RBAC) to your application, based on the [session strategy](/concepts/session-strategies) you choose. Let's see an example for each of these.

## Getting the role

We are going to start by adding a `profile()` callback to the providers' config to determine the user role:

```ts title="/pages/api/auth/[...nextauth].ts"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export default NextAuth({
  providers: [
    Google({
      profile(profile) {
        return { role: profile.role ?? "user", ... }
      },
      ...
    })  
  ],
})
```

:::tip
To determine the user's role, you can either add your logic or if your provider assigns roles already, use that instead.
:::

## Persisting the role
### With JWT

When you don't have a database configured, the role will be persisted in a cookie, by using the `jwt()` callback. On sign-in, the `role` property is exposed from the `profile` callback on the `user` object. Persist the `user.role` value by assigning it to `token.role`. That's it!

If you also want to use the role on the client, you can expose it via the `session` callback.

```ts title="/pages/api/auth/[...nextauth].ts"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

export default NextAuth({
  providers: [
    Google({
      profile(profile) {
        return { role: profile.role ?? "user", ... }
      },
      ...
    })  
  ],
  // highlight-start
  callbacks: {
    jwt({ token, user }) {
      if(user) token.role = user.role
      return token
    },
    session({ session, token }) {
      session.user.role = token.role
      return session
    }
  }
  // highlight-end
})
```

:::info
With this strategy, if you want to update the role, the user needs to be forced to sign in again.
:::

### With Database

When you have a database, you can save the user role on the [User model](/reference/adapters/models#user). The below example is showing you how to do this with Prisma, but the idea is the same for all adapters.

First, add a `role` column to the User model.

```ts title="/prisma/schema.prisma"
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          String?  // New column
  accounts      Account[]
  sessions      Session[]
}
```

The `profile()` callback's return value is used to create users in the database. That's it! Your newly created users will now have an assigned role.

If you also want to use the role on the client, you can expose it via the `session` callback.

```ts title="/pages/api/auth/[...nextauth].ts"
import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
  // highlight-next-line
import prisma from "lib/prisma"

export default NextAuth({
  // highlight-next-line
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      profile(profile) {
        return { role: profile.role ?? "user", ... }
      }
      ...
    })  
  ],
  // highlight-start
  callbacks: {
    session({ session, user }) {
      session.user.role = user.role
      return session
    }
  }
  // highlight-end
})
```

:::info
It is up to you how you want to manage to update the roles, either through direct database access or building your role update API.
:::

## Using the role

If you want to use the role in the client, for both cases above, when using the `useSession` hook, `session.user.role` will have the required role if you exposed it via the `session` callback. You can use this to render a different UI for different users.

```ts title="/pages/admin.tsx"
import { useSession } from "next-auth/react"

export default function Page() {
  const session = await useSession()

  if (session?.user.role === "admin") {
    return <p>You are an admin, welcome!</p>
  }

  return <p>You are not authorized to view this page!</p>
}
```

:::tip
When using Next.js and JWT, you can alternatively also use [Middleware](https://next-auth.js.org/configuration/nextjs#wrap-middleware) to redirect the user based on their role, even before rendering the page.
:::

## Resources

- [Concepts: Session strategies](/concepts/session-strategies)
- [Next.js: Middleware](https://next-auth.js.org/configuration/nextjs#wrap-middleware)
- [Adapters: User model](/reference/adapters/models#user)
- [Adapters: Prisma adapter](/reference/adapters/prisma)
- [TypeScript](/getting-started/typescript)
