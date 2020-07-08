---
id: models
title: Models
---

## Overview

This a description of the models and data structure used by NextAuth.js default database adapter (TypeORM).

You can define your own models and schemas or [create your own database adapter](/tutorials/creating-a-database-adapter).

In NextAuth.js all table/collection names are plural, and all table names and column names use snake_case when used with an SQL database and camelCase when used with Document database. Indexes are declared on properties where appropriate.

:::tip
Models in NextAuth.js are built for ANSI SQL but are polymorphic and are transformed to adapt to the database being used; there is some variance in specific data types (e.g. for datetime, text fields, etc).
:::

### User

Table: `users`

**Description:**

The User model is for information such as the users name and email address.

Email address are optional, but if one is specified for a User then it must be unique.

:::note
If a user first signs in with OAuth then their email address is automatically populated using the one from their OAuth profile, if the OAuth provider returns one.

This provides a way to contact users and for users to maintain access to their account and sign in using email in the event they are unable to sign in with the OAuth provider in future (if email sign in is configured).
:::

### Account 

Table: `accounts`

**Description:**

The Account model is for information about OAuth accounts associated with a User.

A single User can have multiple Accounts, each Account can only have one User.

### Session

Table: `sessions`

**Description:**

The Session model is used for database sessions. It is not used if JSON Web Tokens are enabled.

A single User can have multiple Sessions, each Session can only have one User.

### Verification Request

Table: `verification_requests`

**Description:**

The Verification Request model is used to store tokens for passwordless sign in emails.

A single User can have multiple open Verification Requests (e.g. to sign in to different devices).

It has been designed to be extendable for other verification purposes in future (e.g. 2FA / short codes).

:::note
See `src/adapters/typeorm/models` for the source for the current models and schemas.
:::

---

## Schemas

NextAuth.js uses a different schemas to implement the model for each database.

They are all functionally equivalent but the syntax is specific to each database. 

For more information, refer to the schema documentation for each database.

### [MySQL](/schemas/mysql)
### [Postgres](/schemas/postgres)
### [MongoDB](/schemas/mongodb)

:::note
There is no schema documentation for SQLite. It functions similarly to the other SQL databases. SQLite support is intended for local development and testing.
:::