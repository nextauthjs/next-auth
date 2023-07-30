```diff title='middleware.ts'
- export { default } from 'next-auth/middleware'
+ export { auth as default } from "./auth"
```

For advanced use cases, you can use `auth` as a wrapper for your Middleware:

```ts title="middleware.ts"
import { auth } from "./auth"

export default auth(req => {
  // req.auth
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

```

Read the [Middleware docs](/reference/nextjs#in-middleware) for more details.