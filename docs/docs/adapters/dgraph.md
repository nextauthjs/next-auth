---
id: dgraph
title: Dgraph
---

# Dgraph

This is the Dgraph Adapter for [`next-auth`](https://next-auth.js.org).

## Getting Started

1. Install the necessary packages

```bash npm2yarn
npm install next-auth @next-auth/dgraph-adapter
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```javascript title="pages/api/auth/[...nextauth].js"
import NextAuth from "next-auth"
import { DgraphAdapter } from "@next-auth/dgraph-adapter"

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [],
  adapter: DgraphAdapter({
    endpoint: process.env.DGRAPH_GRAPHQL_ENDPOINT,
    authToken: process.env.DGRAPH_GRAPHQL_KEY,

    // you can omit the following properties if you are running an unsecure schema
    authHeader: process.env.AUTH_HEADER, // default: "Authorization",
    jwtSecret: process.env.SECRET,
  }),
})
```

## Quick start with the unsecure schema

The quickest way to use Dgraph is by applying the unsecure schema to your [local](https://dgraph.io/docs/graphql/admin/#modifying-a-schema) Dgraph instance or if using Dgraph [cloud](https://dgraph.io/docs/cloud/cloud-quick-start/#the-schema) you can paste the schema in the codebox to update.

:::warning
This approach is not secure or for production use, and does not require a `jwtSecret`.
:::

> This schema is adapted for use in Dgraph and based upon our main [schema](/adapters/models)

#### Unsecure schema

```graphql
type Account {
  id: ID
  type: String
  provider: String @search(by: [hash])
  providerAccountId: String @search(by: [hash])
  refreshToken: String
  expires_at: Int64
  accessToken: String
  token_type: String
  refresh_token: String
  access_token: String
  scope: String
  id_token: String
  session_state: String
  user: User @hasInverse(field: "accounts")
}
type Session {
  id: ID
  expires: DateTime
  sessionToken: String @search(by: [hash])
  user: User @hasInverse(field: "sessions")
}
type User {
  id: ID
  name: String
  email: String @search(by: [hash])
  emailVerified: DateTime
  image: String
  accounts: [Account] @hasInverse(field: "user")
  sessions: [Session] @hasInverse(field: "user")
}

type VerificationToken {
  id: ID
  identifier: String @search(by: [hash])
  token: String @search(by: [hash])
  expires: DateTime
}
```

## Securing your database

For production deployments you will want to restrict the access to the types used
by next-auth. The main form of access control used in Dgraph is via `@auth` directive alongide types in the schema.

#### Secure schema

```graphql
type Account
  @auth(
    delete: { rule: "{$nextAuth: { eq: true } }" }
    add: { rule: "{$nextAuth: { eq: true } }" }
    query: { rule: "{$nextAuth: { eq: true } }" }
    update: { rule: "{$nextAuth: { eq: true } }" }
  ) {
  id: ID
  type: String
  provider: String @search(by: [hash])
  providerAccountId: String @search(by: [hash])
  refreshToken: String
  expires_at: Int64
  accessToken: String
  token_type: String
  refresh_token: String
  access_token: String
  scope: String
  id_token: String
  session_state: String
  user: User @hasInverse(field: "accounts")
}
type Session
  @auth(
    delete: { rule: "{$nextAuth: { eq: true } }" }
    add: { rule: "{$nextAuth: { eq: true } }" }
    query: { rule: "{$nextAuth: { eq: true } }" }
    update: { rule: "{$nextAuth: { eq: true } }" }
  ) {
  id: ID
  expires: DateTime
  sessionToken: String @search(by: [hash])
  user: User @hasInverse(field: "sessions")
}
type User
  @auth(
    query: {
      or: [
        {
          rule: """
          query ($userId: String!) {queryUser(filter: { id: { eq: $userId } } ) {id}}
          """
        }
        { rule: "{$nextAuth: { eq: true } }" }
      ]
    }
    delete: { rule: "{$nextAuth: { eq: true } }" }
    add: { rule: "{$nextAuth: { eq: true } }" }
    update: {
      or: [
        {
          rule: """
          query ($userId: String!) {queryUser(filter: { id: { eq: $userId } } ) {id}}
          """
        }
        { rule: "{$nextAuth: { eq: true } }" }
      ]
    }
  ) {
  id: ID
  name: String
  email: String @search(by: [hash])
  emailVerified: DateTime
  image: String
  accounts: [Account] @hasInverse(field: "user")
  sessions: [Session] @hasInverse(field: "user")
}

type VerificationToken
  @auth(
    delete: { rule: "{$nextAuth: { eq: true } }" }
    add: { rule: "{$nextAuth: { eq: true } }" }
    query: { rule: "{$nextAuth: { eq: true } }" }
    update: { rule: "{$nextAuth: { eq: true } }" }
  ) {
  id: ID
  identifier: String @search(by: [hash])
  token: String @search(by: [hash])
  expires: DateTime
}

# Dgraph.Authorization {"VerificationKey":"<YOUR JWT SECRET HERE>","Header":"<YOUR AUTH HEADER HERE>","Namespace":"<YOUR CUSTOM NAMESPACE HERE>","Algo":"HS256"}
```

#### Dgraph.Authorization

In order to secure your graphql backend define the `Dgraph.Authorization` object at the
bottom of your schema and provide `authHeader` and `jwtSecret` values to the DgraphClient.

```js
# Dgraph.Authorization {"VerificationKey":"<YOUR JWT SECRET HERE>","Header":"<YOUR AUTH HEADER HERE>","Namespace":"YOUR CUSTOM NAMESPACE HERE","Algo":"HS256"}
```

#### VerificationKey and jwtSecret

This is the key used to sign the JWT. Ex. `process.env.SECRET` or `process.env.APP_SECRET`.

#### Header and authHeader

The `Header` tells Dgraph where to lookup a JWT within the headers of the incoming requests made to the dgraph server.
You have to configure it at the bottom of your schema file. This header is the same as the `authHeader` property you
provide when you instantiate the `DgraphClient`.

#### The nextAuth secret

The `$nextAuth` secret is securely generated using the `jwtSecret` and injected by the DgraphAdapter in order to allow interacting with the JWT DgraphClient for anonymous user requests made within the system `ie. login, register`. This allows
secure interactions to be made with all the auth types required by next-auth. You have to specify it for each auth rule of
each type defined in your secure schema.

```js
type VerificationRequest
  @auth(
    delete: { rule: "{$nextAuth: { eq: true } }" },
    add: { rule: "{$nextAuth: { eq: true } }" },
    query: { rule: "{$nextAuth: { eq: true } }" },
    update: { rule: "{$nextAuth: { eq: true } }" }
  ) {
 ...
}
```

## Working with JWT session and @auth directive

Dgraph only works with HS256 or RS256 algorithms. If you want to use session jwt to securely interact with your dgraph
database you must customize next-auth `encode` and `decode` functions, as the default algorithm is HS512. You can
further customize the jwt with roles if you want to implement [`RBAC logic`](https://dgraph.io/docs/graphql/authorization/directive/#role-based-access-control).

```js
import * as jwt from "jsonwebtoken";
export default NextAuth({
  session: {
    strategy: "jwt"
  },
  jwt: {
    secret: process.env.SECRET,
    encode: async ({ secret, token }) => {
      return jwt.sign({...token, userId: token.id}, secret, {
        algorithm: "HS256",
        expiresIn: 30 * 24 * 60 * 60; // 30 days
      });
    },
    decode: async ({ secret, token }) => {
      return jwt.verify(token, secret, { algorithms: ["HS256"] });
    }
  },
})
```

Once your `Dgraph.Authorization` is defined in your schema and the JWT settings are set, this will allow you to define
[`@auth rules`](https://dgraph.io/docs/graphql/authorization/authorization-overview/) for every part of your schema.
