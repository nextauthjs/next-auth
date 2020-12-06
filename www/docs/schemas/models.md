---
id: models
title: Models
---

Models in NextAuth.js are built for ANSI SQL but are polymorphic and are transformed to adapt to the database being used; there is some variance in specific data types (e.g. for datetime, text fields, etc) but they are functionally the same with as much parity in behaviour as possible.

All table/collection names in the built in models are plural, and all table names and column names use `snake_case` when used with an SQL database and `camelCase` when used with Document database.

:::note
You can [extend the built in models](/tutorials/typeorm-custom-models) and even [create your own database adapter](/tutorials/creating-a-database-adapter) if you want to use NextAuth.js with a database that is not supported out of the box.
:::


---

## User

Table: `users`

**Description:**

The User model is for information such as the users name and email address.

Email address are optional, but if one is specified for a User then it must be unique.

:::note
If a user first signs in with OAuth then their email address is automatically populated using the one from their OAuth profile, if the OAuth provider returns one.

This provides a way to contact users and for users to maintain access to their account and sign in using email in the event they are unable to sign in with the OAuth provider in future (if email sign in is configured).
:::

## Account 

Table: `accounts`

**Description:**

The Account model is for information about OAuth accounts associated with a User.

A single User can have multiple Accounts, each Account can only have one User.

## Session

Table: `sessions`

**Description:**

The Session model is used for database sessions. It is not used if JSON Web Tokens are enabled.

A single User can have multiple Sessions, each Session can only have one User.

## Verification Request

Table: `verification_requests`

**Description:**

The Verification Request model is used to store tokens for passwordless sign in emails.

A single User can have multiple open Verification Requests (e.g. to sign in to different devices).

It has been designed to be extendable for other verification purposes in future (e.g. 2FA / short codes).