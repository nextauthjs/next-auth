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

This schema is adapted for use in Neo4J and is based upon our main [models](/reference/adapters/models). Please check there for the node properties. Relationships have no properties.

### Indexes

Optimum indexes will vary on your edition of Neo4j i.e. community or enterprise, and in case you have your own additional data on the nodes. Below are basic suggested indexes.

1. For **both** Community Edition & Enterprise Edition create constraints and indexes

#### Neo4j v5

```cypher

CREATE CONSTRAINT user_id_constraint IF NOT EXISTS
FOR (u:User) REQUIRE u.id IS UNIQUE;

CREATE INDEX user_id_index IF NOT EXISTS
FOR (u:User) ON (u.id);

CREATE INDEX user_email_index IF NOT EXISTS
FOR (u:User) ON (u.email);

CREATE CONSTRAINT session_session_token_constraint IF NOT EXISTS
FOR (s:Session) REQUIRE s.sessionToken IS UNIQUE;

CREATE INDEX session_session_token_index IF NOT EXISTS
FOR (s:Session) ON (s.sessionToken);
```

#### Neo4j v4 and below

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

2.a. For Community Edition **only** create single-property indexes

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

2.b. For Enterprise Edition **only** create composite node key constraints and indexes

#### Neo4j v5

```cypher
CREATE CONSTRAINT account_provider_composite_constraint IF NOT EXISTS
FOR (a:Account) REQUIRE (a.provider, a.providerAccountId) IS NODE KEY;

CREATE INDEX account_provider_composite_index IF NOT EXISTS
FOR (a:Account) ON (a.provider, a.providerAccountId);

CREATE CONSTRAINT verification_token_composite_constraint IF NOT EXISTS
FOR (v:VerificationToken) REQUIRE (v.identifier, v.token) IS NODE KEY;

CREATE INDEX verification_token_composite_index IF NOT EXISTS
FOR (v:VerificationToken) ON (v.identifier, v.token);
```

#### Neo4j v4 and below

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
