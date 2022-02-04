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

User creation in the database is automatic, and happens when the user is logging in for the first time with a provider. The default data saved is `id`, `name`, `email` and `image`. You can add more profile data by returning extra fields in your [OAuth provider's `profile()`](/configuration/providers/oauth#options) callback.

## Account

The Account model is for information about OAuth accounts associated with a User. It will usually contain `access_token`, `id_token` and other OAuth specific data. [`TokenSet`](https://github.com/panva/node-openid-client/blob/main/docs/README.md#new-tokensetinput) from `openid-client` might give you an idea of all the fields.

:::note
In case of an OAuth 1.0 provider (like Twitter), you will have to look for `oauth_token` and `oauth_token_secret` string fields. GitHub also has an extra `refresh_token_expires_in` integer field. You have to make sure that your database schema includes these fields.
:::

A single User can have multiple Accounts, but each Account can only have one User.

Linking Accounts to Users happen automatically, only when they have the same e-mail address, and the user is currently signed in. Check the [FAQ](/faq#security) for more information why this is a requirement.

:::tip
You can manually unlink accounts, if your adapter implements the `unlinkAccount` method. Make sure to take all the necessary security steps to avoid data loss.
:::

:::note
Linking and unlinking accounts through an API is a planned feature: https://github.com/nextauthjs/next-auth/issues/230
:::

## Session

The Session model is used for database sessions. It is not used if JSON Web Tokens are enabled. Keep in mind, that you can use a database to persist Users and Accounts, and still use JWT for sessions. See the [`session.strategy`](/configuration/options#session) option.

A single User can have multiple Sessions, each Session can only have one User.

:::tip
When a Session is read, we check if it's `expires` field indicates an invalid session, and delete it from the database. You can also do this clean-up periodically in the background to avoid our extra delete call to the database during an active session retrieval. This might result in a slight performance increase in a few cases.
:::

## Verification Token

The Verification Token model is used to store tokens for passwordless sign in.

A single User can have multiple open Verification Tokens (e.g. to sign in to different devices).

It has been designed to be extendable for other verification purposes in the future (e.g. 2FA / short codes).

:::note
NextAuth.js makes sure that every token is usable only once, and by default has a short (1 day, can be configured by [`maxAge`](/configuration/providers/email#options)) lifetime. If your user did not manage to finish the sign-in flow in time, they will have to start the sign-in process again.
:::

:::tip
Due to users forgetting or failing at the sign-in flow, you might end up with unwanted rows in your database, that you might have to periodically clean up to avoid filling the database up with unnecessary data.
:::

## RDBMS Naming Convention

In the NextAuth.js v4 some schemas for the providers which support classic RDBMS type databases, like Prisma and TypeORM, have ended up with column names with mixed casing, i.e. snake_case and camelCase. If this is an issue for you or your underlying database system, please take a look at the "Naming Convention" section in the Prisma or TypeORM page.
