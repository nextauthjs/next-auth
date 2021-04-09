---
id: typescript
title: TypeScript
---

TypeScript comes with its own types, so you can safely use it in your TypeScript projects. Even if you don't use TypeScript, IDEs like VSCode will pick this up, to provide you with a better developer experience. While you are typing, you will get suggestions of what certain objects are, and sometimes also links to documentation, and examples.

:::note
 The types at [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) under the name of `@types/next-auth` are now deprecated, and not maintained anymore.
:::

***
## Module Augmentaion

`next-auth` comes with certain types/interfaces, that are shared across submodules. Good examples are `Session` and `JWT`. Ideally, you should only need to create these types at a single place, and TS should pick them up in every location where they are referenced. Luckily, this is exactly what Module Agumentation can do for us. Define your shared interfaces in a single location, and get type-safety across your application, when you use `next-auth` (or one of its submodules).

1. Let's look at `Session`:

```ts title="pages/api/[...nextauth].ts"
import NextAuth from "next-auth"

export default NextAuth({
  callbacks: {
    session(session, token) {
      return session // The type here should match the one returned in `useSession()`
    }
  }
})
```

```ts title="pages/index.ts"
import { useSession } from "next-auth/client"

export default function IndexPage() {
  // `session` should match `callbacks.session()` in `NextAuth()`
  const [session] = useSession() 

  return (
    // Your component
  )
}
```

To extend/augment this type, create a `@types/next-auth.d.ts` file in your project:

```ts title="@types/next-auth.d.ts"
import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      /** The user's postal address. */
      address: string
    }
  }
}
```

Make sure that the `@types` folder is added to [`typeRoots`](https://www.typescriptlang.org/tsconfig/#typeRoots) in your project's `tsconfig.json` file.

2. Check out `JWT` also:

```ts title="@types/next-auth.d.ts"
declare module "next-auth/jwt" {
  interface JWT {
    /** OpenID ID Token */
    idToken?: string
  }
}
```

Note that this time we declared `JWT` inside `next-auth/jwt`, as this is its default location.


## Contributing

Contributions of any kind are always welcome, especially for TypeScript. Please keep in mind that we are a small team working on this project in our free time. We will try our best to give support, but if you think you have a solution for a problem, please open a PR!