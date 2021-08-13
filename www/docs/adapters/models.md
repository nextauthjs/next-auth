---
id: models
title: Models
---

NextAuth.js can be used with any database. Models tell you what structures NextAuth.js expects from your database. Models will vary slightly depending on which adapter you use, but in general will look something like this.

![v4 Schema](/img/nextauth_v4_schema.png)

More information about each Model / Table can be found below.

:::note
You can [create your own adapter](/tutorials/creating-a-database-adapter) if you want to use NextAuth.js with a database that is not supported out of the box, or you have to change fields on any of the models.
:::

---

## User

The User model is for information such as the user's name and email address.

Email address is optional, but if one is specified for a User then it must be unique.

:::note
If a user first signs in with OAuth then their email address is automatically populated using the one from their OAuth profile, if the OAuth provider returns one.

This provides a way to contact users and for users to maintain access to their account and sign in using email in the event they are unable to sign in with the OAuth provider in future (if the [Email Provider](/providers/email) is configured).
:::

## Account

The Account model is for information about OAuth accounts associated with a User.

A single User can have multiple Accounts, but each Account can only have one User.

Linking Accounts to Users happen automatically, only when they have the same e-mail address, and the user is currently signed in. Check the [FAQ](/faq#security) for more information why this is a requirement.

## Session

The Session model is used for database sessions. It is not used if JSON Web Tokens are enabled. Keep in mind, that you can use a database to persist Users and Accounts, and still use JWT for sessions. See the [`session.jwt`](/configuration/options#session) option.

A single User can have multiple Sessions, each Session can only have one User.

## Verification Token

The Verification Token model is used to store tokens for passwordless sign in.

A single User can have multiple open Verification Tokens (e.g. to sign in to different devices).

It has been designed to be extendable for other verification purposes in the future (e.g. 2FA / short codes).

:::note
NextAuth.js makes sure that every token is usable only once, and by default has a short lifetime. If your user did not manage to finish the sign-in flow in time (15 minutes by default), they will have to start the sign-in process again.
:::
