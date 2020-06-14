---
id: models
title: Models
---

## Built-in Models

This a summary of the models and data structure used by NextAuth.js default database adapter.

You are free to define your own models and schemas if you want to use a custom database adapter.

In NextAuth.js all table/collection names are plural, and all table names and column names use snake_case when used with an SQL database and camelCase when used with Document database.

:::tip
Models in NextAuth.js are built for for ANSI SQL but are polymorphic and are transformed to adapt to the database being used; there is some variance in specific data types (e.g. for datetime, text fields, etc).
:::

### User

Table: `users`

**Description:**

The User model is for information such as the users name and email address.

Email address are optional, but if if one is specified for a user it must be unique.

:::note
If a user signs up with OAuth their email is automatically taken from their OAuth profile, if the OAuth provider returns one. This provides a way to contact users and for users to maintain access to their account and sign in using email in the event they are unable to sign in with the OAuth provider in future (as long as an Email Provider is configured).
:::

### Account 

Table: `accounts`

**Description:**

The Account model is for information about OAuth accounts associated with a User.

### Session

Table: `sessions`

**Description:**

The Session model is used for database sessions. It is not used if JSON Web Tokens are enabled.

### Verification Request

Table: `verification_requests`

**Description:**

The Verification Request model is used to store tokens for passwordless sign in emails.

It has been designed to be extentable for other verification purposes in future (e.g. 2FA / short codes).

:::note
See `src/adapters/typeorm/models` for the source for the current models and schemas.
:::

---

## Schemas

### MySQL

* See [MySQL schema documentation](/schemas/mysql) for details.

### Postgres

* See [Postgres schema documentation](/schemas/postgres) for details.

### MongoDB

MongoDB does not use schemas in the same way as most RDBMS databases, but the objects stored in MongoDB use similar datatypes to SQL, with some differences:

* ID fields are of type `ObjectID` rather than `int`
* By convention, all collection names and object properties are `camelCase` rather than `snake_case`
* A sparse index is used on `User.email` to allow it to not be specified, while enforcing uniqueness if it is