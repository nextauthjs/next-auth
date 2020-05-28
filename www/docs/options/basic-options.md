---
id: basic-options
title: Basic Options
---
Configuration options are passed to NextAuth.js when initalizing in your API route.

The only *required* options are **site**, **providers** and **database**.

## Options

### site

* **Default value**: `empty string`
* **Required**: *Yes*

#### Description 

The fully qualified URL of your site e.g. `http://localhost:3000` or `https://www.example.com`

---

### providers

* **Default value**: `[]`
* **Required**: *Yes*

#### Description 

An array of authentication providers for signing in (e.g. Google, Facebook, Twitter, GitHub, Email, etc) in any order. This can be one of the built-in providers or an object with a custom provider.

See the [providers documentation](/options/providers) for a list of supported providers and how to use them.

---

### database

* **Default value**: `null`
* **Required**: *Yes*

#### Description 

A database connection string or [TypeORM](https://github.com/typeorm/typeorm/blob/master/docs/using-ormconfig.md) configuration object.

NextAuth.js has built in support for MySQL, MariaDB, Postgress, MongoDB and SQLite databases.

The default database provider is also compatible with other ANSI SQL compatible databases.

NextAuth.js can can be used with any database by specifying a custom `adapter` option.

---

### secret

* **Default value**: *SHA Hash of Options*
* **Required**: *No* (but is strongly recommended)

#### Description

A random string used to hash tokens and sign cookies (e.g. SHA hash).

If not provided will be auto-generated based on hash of all your provided options.

The default behaviour is secure, but volatile, and it is strongly recommended you explicitly specify a value for your secret to avoid invalidating any tokens when the automatically generated hash changes.

---

### sessionMaxAge

* **Default value**: `30*24*60*60*1000` (30 days)
* **Required**: *No*

#### Description

How long sessions can be idle before they expire and the user has to sign in again.

---

### sessionUpdateAge

* **Default value**: `24*60*60*1000` (24 hours)
* **Required**: *No*

#### Description

How frequently the session expiry should be updated in the database.

This option effectively throttles database writes for sessions, which can improve performance and reduce costs.

It should always be less than `sessionMaxAge`. 

*For example:*

If `sessionMaxAge` specifies a session is valid for up to 30 days and `sessionUpdateAge` is set to 24 hours, and a session was last updated less than 24 hours ago, then the session expiry time on the active session would not be updated.

However, if a session that was active was last updated more than 24 hours ago, then the session expiry time *would* be updated in the session database.

:::tip
If you have a short session max age (e.g. < 24 hours) or if you want to be able to track what sessions have been active recently by querying the session database, you can set **sessionUpdateAge** to **0** to create a rolling session that always extends the session expiry any time a session is active.
:::

---

### verificationMaxAge

* **Default value**: `24*60*60*1000` (24 hours)
* **Required**: *No*

#### Description

How long links in verification emails are valid for.

These are used for passwordless sign in via email.

---

### debug

* **Default value**: `false`
* **Required**: *No*

#### Description

Set debug to `true` to enable debug messages for authenticaiton and database operations.
