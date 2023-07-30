Instead of importing `getServerSession` from `next-auth/next` or `getToken` from `next-auth/jwt`, you can now import the `auth` function from your config file and call it without passing `authOptions`.

```diff title='pages/api/example.ts'
- import { getServerSession } from "next-auth/next"
- import { getToken } from "next-auth/jwt"
- import { authOptions } from 'pages/api/auth/[...nextauth]'
+ import { auth } from "../auth"
+ import { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
-  const session = await getServerSession(req, res, authOptions)
-  const token = await getToken({ req })
+  const session = await auth(req, res)
  if (session) return res.json('Success')
  return res.status(401).json("You must be logged in.");
}
```

:::tip
Whenever `auth()` is passed the res object, it will rotate the session expiry. This was not the case with `getToken()` previously.
The default session expiry is 30 days, but you can change it by setting `authOptions.session.maxAge`.
:::