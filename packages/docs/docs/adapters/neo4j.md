---
id: neo4j
title: Neo4j
---

# Neo4j

This is the Neo4j Adapter for [`next-auth`](https://next-auth.js.org). This package can only be used in conjunction with the primary `next-auth` package. It is not a standalone package.

## Getting Started

1. Install the necessary packages

```bash npm2yarn
npm install next-auth @next-auth/neo4j-adapter neo4j-driver
```

2. Add this adapter to your `pages/api/[...nextauth].js` next-auth configuration object.

```javascript title="pages/api/auth/[...nextauth].js"
import neo4j from "neo4j-driver"
import { Neo4jAdapter } from "@next-auth/neo4j-adapter"

const driver = neo4j.driver(
  "bolt://localhost",
  neo4j.auth.basic("neo4j", "password")
)

const neo4jSession = driver.session()

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth({
  // https://next-auth.js.org/configuration/providers
  providers: [],
  adapter: Neo4jAdapter(neo4jSession),
  ...
})
```

## Schema

### Node labels

The following node labels are used.

- User
- Account
- Session
- VerificationToken

### Relationships

The following relationships and relationship labels are used.

- (:User)-[:HAS_ACCOUNT]->(:Account)
- (:User)-[:HAS_SESSION]->(:Session)

### Properties

See [models](/adapters/models) for the node properties. Relationships have no properties.

### Indexes

Optimum indexes will vary on your edition of Neo4j i.e. community or enterprise, and in case you have your own additional data on the nodes. Below are basic suggested indexes.

1. For **both** Community Edition & Enterprise Edition create constraints and indexes

```cypher

CREATE CONSTRAINT user_id_constraint IF NOT EXISTS
ON (u:User) ASSERT u.id IS UNIQUE;

CREATE INDEX user_id_index IF NOT EXISTS
FOR (u:User) ON (u.id);

CREATE INDEX user_email_index IF NOT EXISTS
FOR (u:User) ON (u.email);

CREATE CONSTRAINT session_session_token_constraint IF NOT EXISTS
ON (s:Session) ASSERT s.sessionToken IS UNIQUE;

CREATE INDEX session_session_token_index IF NOT EXISTS
FOR (s:Session) ON (s.sessionToken);
```

2.a.  For Community Edition **only** create single-property indexes

```cypher
CREATE INDEX account_provider_index IF NOT EXISTS
FOR (a:Account) ON (a.provider);

CREATE INDEX account_provider_account_id_index IF NOT EXISTS
FOR (a:Account) ON (a.providerAccountId);

CREATE INDEX verification_token_identifier_index IF NOT EXISTS
FOR (v:VerificationToken) ON (v.identifier);

CREATE INDEX verification_token_token_index IF NOT EXISTS
FOR (v:VerificationToken) ON (v.token);
```

2.b. For Enterprise Edition  **only** create composite node key constraints and indexes 

```cypher
CREATE CONSTRAINT account_provider_composite_constraint IF NOT EXISTS 
ON (a:Account) ASSERT (a.provider, a.providerAccountId) IS NODE KEY;

CREATE INDEX account_provider_composite_index IF NOT EXISTS
FOR (a:Account) ON (a.provider, a.providerAccountId);

CREATE CONSTRAINT verification_token_composite_constraint IF NOT EXISTS 
ON (v:VerificationToken) ASSERT (v.identifier, v.token) IS NODE KEY;

CREATE INDEX verification_token_composite_index IF NOT EXISTS
FOR (v:VerificationToken) ON (v.identifier, v.token);
```
