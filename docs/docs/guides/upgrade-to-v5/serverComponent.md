NextAuth.js v4 has supported reading the session in Server Components for a while via `getServerSession`. This has been also simplified to the same `auth()` function.

```diff title="app/page.tsx"
- import { authOptions } from 'pages/api/auth/[...nextauth]'
- import { getServerSession } from "next-auth/next"
+ import { auth } from "../auth"

export default async function Page() {
-  const session = await getServerSession(authOptions)
+  const session = await auth()
  return (<p>Welcome {session?.user.name}!</p>)
}
```