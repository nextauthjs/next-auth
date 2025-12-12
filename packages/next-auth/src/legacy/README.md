# NextAuth.js Legacy Module

This module provides backward compatibility for Next.js Pages Router and older versions of NextAuth.js. It includes deprecated features and APIs that are no longer recommended for new projects.

## Usage

For new projects, we recommend using the App Router and the new NextAuth.js APIs. However, if you need to maintain compatibility with the Pages Router or older code, you can use this legacy module:

```typescript
import NextAuth from "next-auth/legacy"

export default NextAuth({
  // your config here
})
```

## Deprecated Features

This module includes the following deprecated features:

- Pages Router API Routes
- `withAuth` HOC
- `getServerSession` (old version)
- `getSession` (old version)
- `useSession` (old version)
- `SessionProvider` (old version)
- `signIn` and `signOut` (old versions)
- `middleware` (old version)

## Migration Guide

We strongly recommend migrating to the new App Router and NextAuth.js APIs. Please refer to our [migration guide](https://next-auth.js.org/getting-started/migration) for more information.
