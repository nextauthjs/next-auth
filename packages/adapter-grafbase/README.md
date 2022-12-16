<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="logo.svg" />
   <h3 align="center"><b>Grafbase Adapter</b> - NextAuth.js</h3>
   <p align="center">
   GraphQL backends made easy.
   </p>
</p>

## Overview

This is the [Grafbase](https://grafbase.com) Adapter for [`next-auth`](https://github.com/nextauthjs/next-auth).

This package works together with NextAuth.js and Grafbase Auth &mdash; [learn more](https://grafbase.com/docs/auth/overview).

## Usage

1. Install `next-auth` and `@next-auth/grafbase-adapter`:

```bash
npm install next-auth @next-auth/grafbase-adapter
```

2. Import `GrafbaseAdapter` and add to the `next-auth` configuration object:

```typescript title="pages/api/auth/[...nextauth].ts"
import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { GrafbaseAdapter } from "@next-auth/grafbase-adapter"

export default NextAuth({
  adapter: GrafbaseAdapter({
    url: process.env.GRAFBASE_API_URL,
    apiKey: process.env.GRAFBASE_API_KEY,
  }),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
})
```

3. Initialize a Grafbase backend in the root of your project:

```bash
npx grafbase init
```

4. Add the following models to your `grafbase/schema.graphql` file:

```graphql
type Account @model {
  id: ID!
  type: String!
  provider: String!
  providerAccountId: String!
  refreshToken: String
  accessToken: String
  expiresAt: Int
  tokenType: String
  scope: String
  idToken: String
  sessionState: String
  user: User!
}

type Session @model {
  id: ID!
  sessionToken: String! @unique
  expires: DateTime!
  user: User!
}

type User @model {
  id: ID!
  name: String
  email: Email! @unique
  emailVerified: DateTime
  image: String
  accounts: [Account]
  sessions: [Session]
}
```

5. Run your backend locally, or deploy to the edge:

```bash
npx grafbase dev
```

You will want to add the `GRAFBASE_API_URL` with your local backend URL to `.env.local`. You can ignore the apiKey in development.

## Contributing

This project is open-source. PRs welcome!

## License

ISC
