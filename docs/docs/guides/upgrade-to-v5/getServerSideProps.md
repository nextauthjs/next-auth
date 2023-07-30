Instead of importing `getServerSession` from `next-auth/next` or `getToken` from `next-auth/jwt`, you can now import the `auth` function from your config file and call it without passing `authOptions`.

```diff title="pages/protected.tsx"
- import { getServerSession } from "next-auth/next"
- import { getToken } from "next-auth/jwt"
- import { authOptions } from 'pages/api/auth/[...nextauth]'
+ import { auth } from "../auth"

export const getServerSideProps: GetServerSideProps = async (context) => {
-  const session = await getServerSession(context.req, context.res, authOptions)
-  const token = await getToken({ req: context.req })
+  const session = await auth(context)
  if (session) // Do something with the session

  return { props: { session } }
}
```

:::tip
Whenever `auth()` is passed the res object, it will rotate the session expiry. This was not the case with `getToken()` previously.
:::