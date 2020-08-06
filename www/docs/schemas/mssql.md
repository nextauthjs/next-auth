---
id: mssql
title: Microsoft SQL Server
---

Schema for a Microsoft SQL Server (mssql) database.

:::note
When using a  Microsoft SQL Server database with the default adapter (TypeORM) all properties of type `timestamp` are transformed to `datetime`.

This transform is also applied to any properties of type `timestamp` when using custom models.
:::

```sql
CREATE TABLE accounts
  (
    id                    int IDENTITY(1,1) NOT NULL,
    compound_id           varchar(255) NOT NULL,
    user_id               int NOT NULL,
    provider_type         varchar(255) NOT NULL,
    provider_id           varchar(255) NOT NULL,
    provider_account_id   varchar(255) NOT NULL,
    refresh_token         text NULL,
    access_token          text NULL,
    access_token_expires  datetime NULL,
    created_at            datetime NOT NULL DEFAULT getdate(),
    updated_at            datetime NOT NULL DEFAULT getdate()
  );

CREATE TABLE sessions
  (
    id            int IDENTITY(1,1) NOT NULL,
    user_id       int NOT NULL,
    expires       datetime NOT NULL,
    session_token varchar(255) NOT NULL,
    access_token  varchar(255) NOT NULL,
    created_at    datetime NOT NULL DEFAULT getdate(),
    updated_at    datetime NOT NULL DEFAULT getdate()
  );

CREATE TABLE users
  (
    id              int IDENTITY(1,1) NOT NULL,
    name            varchar(255) NULL,
    email           varchar(255) NULL,
    email_verified  datetime NULL,
    image           varchar(255) NULL,
    created_at      datetime NOT NULL DEFAULT getdate(),
    updated_at      datetime NOT NULL DEFAULT getdate()
  );

CREATE TABLE verification_requests
  (
    id          int IDENTITY(1,1) NOT NULL,
    identifier  varchar(255) NOT NULL,
    token       varchar(255) NOT NULL,
    expires     datetime NOT NULL,
    created_at  datetime NOT NULL DEFAULT getdate(),
    updated_at  datetime NOT NULL DEFAULT getdate()
  );
```

:::warning
The above schema is incomplete, it does not include indexes.

When using NextAuth.js with SQL Server fir the first time, run NextAuth.js once against your database with `?syncronize=true` on the connection string and export the schema that is created.
:::