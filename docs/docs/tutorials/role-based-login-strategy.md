To add based authentication to your application, you must do three things.

1. Update your database schema
2. Add the `role` to the session object
3. Check for `role` in your pages/components

First modify the `user` table and add a `role` column with the type of `String?`.

Below is an example Prisma schema file.

```javascript title="/prisma/schema.prisma"
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          String?  // New Column
  accounts      Account[]
  sessions      Session[]
}

```

Next, implement a custom session callback in the `[...nextauth].js` file, as shown below.

```javascript title="/pages/api/auth/[...nextauth].js"
callbacks: {
  async session({ session, token, user }) {
    session.user.role = user.role; // Add role value to user object so it is passed along with session
    return session;
},
```

Going forward, when using the `getSession` hook, check that `session.user.role` matches the required role. The example below assumes the role `'admin'` is required.

```javascript title="/pages/admin.js"
import { getSession } from "next-auth/react"

export default function Page() {
  const session = await getSession({ req })

  if (session && session.user.role === "admin") {
    return (
      <div>
        <h1>Admin</h1>
        <p>Welcome to the Admin Portal!</p>
      </div>
    )
  } else {
    return (
      <div>
        <h1>You are not authorized to view this page!</h1>
      </div>
    )
  }
}
```

Then it is up to you how you manage your roles, either through direct database access or building your own role update API.
