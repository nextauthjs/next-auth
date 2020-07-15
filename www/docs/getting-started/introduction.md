---
id: introduction
title: Introduction
---

## About NextAuth.js

NextAuth.js is a complete open source authentication solution for [Next.js](http://nextjs.org/) applications.

It is designed from the ground up to support Next.js and Serverless.

[Follow the examples](/getting-started/example) to see how easy it is to use NextAuth.js for authentication.

### Flexible and easy to use

* Designed to work with any OAuth service, it supports OAuth 1.0, 1.0A and 2.0
* Built-in support for [many popular sign-in services](/configuration/providers)
* Supports email / passwordless authentication
* Supports stateless authentication with any backend (Active Directory, LDAP, etc)
* Supports both JSON Web Tokens and database sessions
* Designed for Serverless but runs anywhere (AWS Lambda, Docker, Heroku, etc…)

### Own your own data

NextAuth.js can be used with or without a database.

* An open source solution that allows you to keep control of your data
* Supports Bring Your Own Database (BYOD) and can be used with any database
* Built-in support for [MySQL, MariaDB, Postgres, MongoDB and SQLite](/configuration/databases)
* Works great with databases from popular hosting providers
* Can also be used *without a database* (e.g. OAuth + JWT)

*Note: Email sign in requires a database to be configured to store single-use verification tokens.*

### Secure by default

* Promotes the use of passwordless sign in mechanisms
* Designed to be secure by default and encourage best practice for safeguarding user data
* Uses Cross Site Request Forgery Tokens on POST routes (sign in, sign out)
* Default cookie policy aims for the most restrictive policy appropriate for each cookie
* When JSON Web Tokens are enabled, they are signed by default (JWS) with HS512
* Use JWT encryption (JWE) by setting the option `encryption: true` (defaults to A256GCM)
* Auto-generates symmetric signing and encryption keys for developer convenience
* Features tab/window syncing and keepalive messages to support short lived sessions
* Attempts to implement the latest guidance published by [Open Web Application Security Project](https://owasp.org/)

Advanced options allow you to define your own routines to handle controlling what accounts are allowed to sign in, for encoding and decoding JSON Web Tokens and to set custom cookie security policies and session properties, so you can control who is able to sign in and how often sessions have to be re-validated. 

## Acknowledgement

[NextAuth.js 2.0 is possible thanks to its contributors.](/contributors)

## Getting started

[Follow the examples to get started.](/getting-started/example)
