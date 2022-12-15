<p align="center">
   <br/>
   <a href="https://next-auth.js.org" target="_blank"><img height="64px" src="https://next-auth.js.org/img/logo/logo-sm.png" /></a>&nbsp;&nbsp;&nbsp;&nbsp;<img height="64px" src="grafbase.png" />
   <h3 align="center"><b>Grafbase Adapter</b> - NextAuth.js</h3>
   <p align="center">
   GraphQL backends made easy.
   </p>
</p>

## Usage

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

## Get Started

TODO

- Local
- Prod
- Replace schema with `--template` flag

You will need to initialize a new Grafbase backend using the CLI:

```bash
npx grafbase init
```

Next update the file `grafbase/schema.graphql` to include the following:

```graphql
type Account @model {
  type: String!
  provider: String!
  providerAccountId: String! @unique
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
  sessionToken: String! @unique
  expires: DateTime!
  user: User!
}

type User @model {
  name: String
  email: Email! @unique
  emailVerified: DateTime
  image: String
  accounts: [Account]
  sessions: [Session]
}

type VerificationToken {
  identifier: String
  token: String! @unique
  timestamp: DateTime
}
```

## Contributing
