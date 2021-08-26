---
id: postgres
title: Postgres
---

Schema for a Postgres database.

:::note
When using a Postgres database with the default adapter (TypeORM) all properties of type `timestamp` are transformed to `timestamp with time zone`/`timestamptz` and all timestamps are stored in UTC.

This transform is also applied to any properties of type `timestamp` when using custom models.
:::

```sql
CREATE TABLE accounts (
  id SERIAL,
  compound_id VARCHAR(255) NOT NULL,
  user_id INTEGER NOT NULL,
  type VARCHAR(255) NOT NULL,
  provider VARCHAR(255) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  access_token_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE sessions (
  id SERIAL,
  user_id INTEGER NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  session_token VARCHAR(255) NOT NULL,
  access_token VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE users (
  id SERIAL,
  name VARCHAR(255),
  email VARCHAR(255),
  email_verified TIMESTAMPTZ,
  image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE TABLE verification_tokens (
  id SERIAL,
  identifier VARCHAR(255) NOT NULL,
  token VARCHAR(255) NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
);

CREATE UNIQUE INDEX compound_id ON accounts(compound_id);
CREATE INDEX provider_account_id ON accounts(provider_account_id);
CREATE INDEX user_id ON accounts(user_id);
CREATE UNIQUE INDEX session_token ON sessions(session_token);
CREATE UNIQUE INDEX access_token ON sessions(access_token);
CREATE UNIQUE INDEX email ON users(email);
CREATE UNIQUE INDEX token ON verification_tokens(token);

```
