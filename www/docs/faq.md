---
id: faq
title: Frequently Asked Questions
---

## About NextAuth.js

### Is NextAuth.js commercial software?

NextAuth.js is an open source project built by individual contributors.

It is not commercial software and is not associated with a commercial organization.

---

## Compatibility

### What databases does NextAuth.js support?

You can use NextAuth.js with MySQL, MariaDB, Postgres, MongoDB and SQLite or without a database.

You can use also NextAuth.js with any database using a custom database adapter, or by using a custom credentials authentication provider (e.g. to support signing in with a username and password stored in an existing database).

### What authentication services does NextAuth.js support?

NextAuth.js includes built-in support for signing in with Apple, Auth0, Google, Battle.net, Box, AWS Cognito, Discord, Facebook, GitHub, GitLab, Google, Open ID Identity Server, Mixer, Okta, Slack, Spotify, Twitch, Twitter and Yandex.

NextAuth.js also supports email for passwordless sign in, which is useful for account recovery - or for people who are not able to use an account with the configured OAuth services.

You can also use a custom based provider to support signing in with a username and password stored in an external database and/or using two factor authentication.

### Does NextAuth.js support signing in with a username and password?

NextAuth.js is designed to avoid the need to store passwords for user accounts.

If you have an existing database of usernames and passwords, you can use a custom credentials provider to allow signing in with a username and password stored in an existing database.

_If you use a custom credentials provider user accounts will not be persisted in a database by NextAuth.js (even if one is configured). The option to use JSON Web Tokens for session tokens (which allow sign in without using a session database) must be enabled to use a custom credentials provider._

### Can I use NextAuth.js with a website that does not use Next.js?

NextAuth.js is designed for use with Next.js and Serverless.

You can built a website that handles sign in with Next.js and use access those sessions on a website that does not use Next.js as long as the websites are on the same domain (e.g. 'example.com', 'account.example.com') and a suitable cookie domain policy set for the Session Token cookie.

NextAuth.js does not supporting signing into sites on different domains using the same service.

### Can I use NextAuth.js with React Native?

NextAuth.js is designed to handle sign in a Next.js web application.

It is designed as secure, confidental OAuth2 client with server side authentication flow, which allows it to do things public clients (which store embedded secrets) and browser-only clients cannot do.

It is not intended to be used in native applications on desktop or mobile applications, which typically use public clients (e.g. with client / secrets embedded in the application).

---

## Security 

### I think I've found a security problem, what should I do?

Less serious or edge case issues (e.g. queries about compatibility with optional RFC specifications) can be raised as public issues on GitHub.

If you discover what you think may be a potentially serious security problem, please contact a core team member via a private channel (e.g. via email to me@iaincollins.com) or raise a public issue requesting someone get in touch with you via whatever means you prefer for more details.

### What is the disclosure policy for NextAuth.js?

We practice responsible disclosure.

If you contact us regarding a potentially serious issue, we will endeavor to get back to you within 72 hours and to publish a fix within 30 days. We will responsibly disclose the issue (and credit you with your consent) once a fix to resolve the issue has been released - or after 90 days, which ever is sooner.

### How do I get Refresh Tokens and Access Tokens for an OAuth account?

NextAuth.js provides a solution for authentication, session management and user account creation.

NextAuth.js records Refresh Tokens and Access Tokens on sign in (if supplied by the provider) and it will save them (along with the User ID, Provider and Provider Account ID) to either:

1. A database - if a database connection string is provided
2. A JSON Web Token - if JWT sessions are enabled (e.g. if no database specified)

However, NextAuth.js does not also handle Access Token rotation for you. If this is something you need, currently you will need to write the logic to handle that yourself. 

_This is something we would like to have support for in future but is not in active development._

---

## Feature Requests

### Why doesn't NextAuth.js support [a particular feature]?

NextAuth.js is an open source project built by individual contributors who are volunteers who writing code and providing support to help folks out in their spare time.

If you would like NextAuth.js to support a particular feature the best way to help make that happen is to raise a feature request describing the feature and to offer to work with other contributors to develop and test it.

If you are not able to develop a feature yourself, you can offer sponsor someone to work on it.

### I disagree with a design decision, how can I change your mind?

Product design decisions on NextAuth.js are made by core team members.

You can raise suggestions as feature requests / requests for enhancement.

Requests that provide the detail requested in the template and follow the format requested may be more likely to be supported, as additional detail prompted in the templates often provides important context.

Ultimately if your request is not accepted or is not actively in development, you are always free to fork the project under the terms of the ISC License.

---

## JSON Web Tokens 

### Does NextAuth.js use JSON Web Tokens?

NextAuth.js supports both database session tokens and JWT session tokens.

* If a database is specified, database session tokens will be used by default.
* If no database is specified, JWT session tokens will be used by default.
* JWT sessions can be used in conjuction with a database to persist user account data.

### What are the advantages of JSON Web Tokens?

JSON Web Tokens can be used for session tokens, but are also used for lots of other things, such as sending signed objects between services in authentication flows.

Advantages of using a JWT as a session token include that they do not require a database to store sessions and can be faster and cheaper to run and services using JWT can be easier to scale. You can also include confidential information directly in a JWT (such as an API key you may not wish to expose publically).

### What are the disadvantages of JSON Web Tokens?

You cannot as easily expire a JSON Web Token remotely - doing so requires maintaining a server side blacklist of invalid accounts. Shorter session expiry times are used when using JSON Web Tokens as session tokens to allow sessions to be invalidated sooner, though any session token can be invalidated sooner by rejecting at run time (e.g. when a client tries to perform an action).

NextAuth.js client includes advanced features such as automatic session token rotation, supports sending keep alive messages and tab/window syncing to support secure services that use sessions with short expiry times (e.g. 5-15 minutes), though typically session expiry times are longer as a short expiry times typically an impact on the cost of running a service.

As with database session tokens, JSON Web Tokens are limited in the amount of data you can store in them. There is typically a limit of around 4096 bytes in total for all cookies on a domain, though the exact limit varies between browsers, proxies and hosting services. The more data you try to store in a cookie and the more cookies you send, the closer you will come to this limit.

### Why does NextAuth.js encrypt JSON Web Tokens?

JSON Web Tokens are signed (to prevent tampering) and the contents encoded using Base64, but JSON Web Tokens are not encrypted on their own - anyone with access to a token can decode it and read the contents.

NextAuth.js implements [JSON Web Tokens (RFC 7519)](https://tools.ietf.org/html/rfc7519) by default uses a sign-then-encrypt model using the [Advanced Encryption Standard (RFC 3826)](https://tools.ietf.org/html/rfc3826) to encrypt tokens to ensure data is encoded securely by default. 

You can define custom encoding and decoding routines for JSON Web Tokens to use any encryption method (e.g. [JSON Web Encryption (RFC 7516)](https://tools.ietf.org/html/rfc7516)).

You can disable encryption on tokens by setting the encryption option on the JWT to false. It can be useful to use tokens that are signed (but not encrypted) if you want them to be shared services running on the same domain, as long as the tokens do not contain sensitive information (e.g. secret tokens or API keys).