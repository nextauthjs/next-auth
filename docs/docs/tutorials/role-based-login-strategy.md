First modify the 'user' table to include a "role" column.

The example below shows an update to the suggested Prisma schema file.
```javascript

//schema.prisma
model User {
    id            String    @id @default(cuid())
    name          String?
    email         String?   @unique
    emailVerified DateTime?
    image         String?
    role          String?  //<-- ADD THIS COLUMN
    accounts      Account[]
    sessions      Session[]
}

```

Next implement a custom session callback in the [...nextauth].js file, as shown below.

```javascript

//[...nextauth].js
    callbacks: {
      async session({ session, token, user }) {
        console.log("--Session CALLED--", session, "--user--", user, "--token--", token);
        session.user.role = user.role; //ADD THIS LINE SO THAT ROLE IS INCLUDED AS PART OF SESSION INFO.
        return session;
    },
    
```

Going forward, when using the getSession hook, check that session.user.role matches the required role. Example below assumes the role 'admin' is required.

```javascript

const session = await getSession({ req });

if (session && session.user.role === "admin") {

  //Allow access

} else {

  //Deny access

}
  
```

It's up to you how you manage your roles, either through direct database access or building your own role update API.
