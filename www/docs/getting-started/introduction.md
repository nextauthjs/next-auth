---
id: introduction
title: Introduction
---

## About NextAuth.js

NextAuth.js is a complete open source authentication solution for [Next.js](http://nextjs.org/) applications.

It is designed from the ground up to support Next.js and Serverless.

[Follow the examples](/getting-started/example) to see how easy it is to use NextAuth.js for authentication.

## Features

### Easy authentication

* Designed to work with any OAuth service, it supports OAuth 1.0, 1.0A and 2.0
* Supports both JSON Web Tokens and database sessions
* Built-in support for [many popular OAuth sign-in services](/configuration/providers)
* Supports email / passwordless authentication
* Supports stateless authentication with any backend (Active Directory, LDAP, etc)

### Own your own data

NextAuth.js can be used with or without a database.

* An open source solution that allows you to keep control of your data
* Supports Bring Your Own Database (BYOD) and can be used with any database
* Built-in support for [MySQL, MariaDB, Postgres, MongoDB and SQLite](/configuration/database)
* Works great with databases from popular hosting providers
* Can also be used *without a database* (e.g. OAuth + JWT)

*Note: Email sign in requires a database to store verification tokens - though if you are not too concered about when sign in emails expire, this can be an in-memory database like SQLite.*

### Secure by default

Security focused features include CSRF protection, use of signed cookies, cookie prefixes, secure cookies, HTTP only, host only and secure only cookies, secure URL redirection handling, and promoting passwordless sign-in.

* Designed to be secure by default and promote best practice for safeguarding user data
* Default cookie policy aims for the most restrictive policy appropriate for each cookie
* JSON Web Tokens are signed and encrypted (HMAC+AES) and only accessible server side
* Attempts to implement the latest guidance published by [Open Web Application Security Project](https://owasp.org/)

To keep your site secure while still making it easy to share data between the backend and front end securely [callback methods](/configuration/callbacks) are provided.

The callbacks you send information to the client without having to handle session validation or JSON Web Token encryption /decryption yourself - just read and write JSON objects, and the rest is handled for you.

Advanced options allow you to define your own routines for signin and decoding JSON Web Tokens and to set custom cookie security policies and access controls, so you can control who is able to sign in and how often sessions have to be re-validated. 

## Acknowledgement

[NextAuth.js 2.0 is possible thanks to its contributors.](/contributors)

## Getting started

[Follow the examples to get started.](/getting-started/example)
