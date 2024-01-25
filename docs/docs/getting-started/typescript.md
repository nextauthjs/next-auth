---
title: TypeScript
---

Auth.js is committed to type-safety, so it's written in TypeScript and comes with its own type definitions to use in projects. Even if you don't use TypeScript, IDEs like VSCode will pick this up to provide you with a better developer experience. While you are typing, you will get suggestions about what certain objects/functions look like, and sometimes links to documentation, examples, and other valuable resources.

---

import Tabs from "@theme/Tabs"
import TabItem from "@theme/TabItem"

## Adapters

Check out the [Database Adapters: TypeScript](/getting-started/adapters#typescript) section.

## Module Augmentation

Auth.js libraries come with certain interfaces that are shared across submodules and different Auth.js libraries (For example: `next-auth` and `@auth/prisma-adapter` will rely on types from `@auth/core/types`).

Good examples of such interfaces are `Session` or `User`. You can use TypeScript's [Module Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation) to extend these types to add your own properties.

<details>
<summary>
<b>Why not use <a href="https://www.typescriptlang.org/docs/handbook/2/generics.html">generics</a>?</b>
</summary>
The interfaces that are shared across submodules are not passed to Auth.js library functions as generics.

Whenever these types are used, the functions always expect to return these formats. With generics, one might be able to override the type in one place, but not the other, which would cause the types to be out of sync with the implementation.

With module augmentation, you define the types once, and you can be sure that they are always the same where it's expected.

</details>

Let's look at `User` for example:

<Tabs groupId="frameworks" queryString>
  <TabItem value="next" label="Next.js" default>

```ts
// auth.ts
import NextAuth from "next-auth"

declare module "next-auth" {
  interface User {
    /** The user's postal address. */
    address: string
  }
}

export const { auth } = NextAuth({
  callbacks: {
    session({ session, token, user }) {
      // session.user.address is now a valid property, and will be type-checked
      // in places like `useSession().data.user` or `auth().user`
      return {
        ...session,
        user: {
          ...session.user,
          address: user.address,
        },
      }
    },
  },
})
```

  </TabItem>
  <TabItem value="sveltekit" label="SvelteKit">

```ts
// app.d.ts
import "@auth/sveltekit"

declare module "@auth/sveltekit" {
  interface User {
    /** comment **/
    userId: string
  }
}

// hooks.server.ts
export const handleAuth = SvelteKitAuth({
  providers,
  callbacks: {
    session: async ({ session, token }) => {
      if (token) {
        session.user.userId = token.sub
      }
      return session
    },
  },
})
```

  </TabItem>
  <TabItem value="solidstart" label="SolidStart">

```
  TODO SolidStart
```

  </TabItem>
  <TabItem value="core" label="Vanilla (No Framework)">

```
  TODO Core
```

  </TabItem>
</Tabs>

#### Popular interfaces to augment

Module augmentation is not limited to specific interfaces. You can augment almost anything, but here are some of the more common interfaces that you might need to override in based on your use-case:

<Tabs groupId="frameworks" queryString>
  <TabItem value="next" label="Next.js" default>

```ts
// auth.ts
import "next-auth"

// Declare your framework library
declare module "next-auth" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {}
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {}
}

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `auth`, when using JWT sessions */
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
  }
}
```

  </TabItem>
  <TabItem value="sveltekit" label="SvelteKit" default>

```ts
// app.d.ts
import "@auth/sveltekit"

// Declare your framework library
declare module "@auth/sveltekit" {
  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  interface User {}
  /**
   * The shape of the account object returned in the OAuth providers' `account` callback,
   * Usually contains information about the provider being used, like OAuth tokens (`access_token`, etc).
   */
  interface Account {}

  /**
   * Returned by `useSession`, `auth`, contains information about the active session.
   */
  interface Session {}
}
```

  </TabItem>
</Tabs>

The module declaration can be added to any file that is [included](https://www.typescriptlang.org/tsconfig#include) in your project.

## Useful links

1. [TypeScript documentation: Module Augmentation](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)
2. [Digital Ocean: Module Augmentation in TypeScript](https://www.digitalocean.com/community/tutorials/typescript-module-augmentation)
