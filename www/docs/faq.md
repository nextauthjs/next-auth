---
id: faq
title: Frequently Asked Questions
---

## About NextAuth.js

### Is NextAuth.js a commercial software?

NextAuth.js is an open source project built by individual contributors.

It is not commercial software and is not associated with a commercial organization.

---

## Compatibility

### What databases does NextAuth.js support?

You can use NextAuth.js with MySQL, MariaDB, Postgres, MongoDB and SQLite or without a database.

You can use NextAuth.js with any database using a custom database adapter, or by using a custom authentication provider combined with the `signIn` callback.

### What authentication services does NextAuth.js support?

NextAuth.js includes built-in support for signing in with Apple, Auth0, Google, Battle.net, Box, AWS Cognito, Discord, Facebook, GitHub, GitLab, Google, Open ID Identity Server, Mixer, Okta, Slack, Spotify, Twitch, Twitter and Yandex.

You can also use email for passwordless sign in or a custom based provider to support signing in with a username and password or using two factor authentication.

### Does NextAuth.js support signing in with a username and password?

NextAuth.js is designed to avoid the need to store passwords for user accounts.

If you have an existing database of usernames and passwords, you can use a custom credentials provider to allow signing in with a username and password stored in an existing database.

If you use a custom credentials provider users will not be persisted in a database by NextAuth.js, for this reason JSON Web Tokens must be enabled to use a custom credentials provider.

### Can I use NextAuth.js with a website that does not use Next.js?

NextAuth.js is designed for use with Next.js and Serverless.

You can built a website that handles sign in with Next.js and use access those sessions on a website that does not use Next.js as long as the websites are on the same domain (e.g. 'example.com', 'account.example.com') and a suitable cookie domain policy set for the Session Token cookie.

NextAuth.js does not supporting signing into sites on different domains using the same service.

### Can I use NextAuth.js with React Native?

NextAuth.js is designed to handle sign in via a Next.js web application.

It is not intended to be used in native applications on desktop or mobile.

---

## Security 

### How do I disclose a security problem?

If you discover a potentially sensitive security problem, please contacting a core team member via a private channel (e.g. via email to me@iaincollins.com). Less serious issues can be raised as public issues on GitHub.

With regard to potentially serious issues, we will endeavor to get back to you within 72 hours and to provide a fix within 30 days - and disclose the issue (with due credit) once a fix is available - or to publish it sooner than 30 days, if a fix is deemed not possible.

### How do I get Refresh Tokens and Access Tokens for an OAuth account?

NextAuth.js provides a solution for authentication, session management and user account creation.

NextAuth.js records Refresh Tokens and Access Tokens on sign in (if supplied by the provider) and it will save them (along with the User ID, Provider and Provider Account ID) to either:

1. a database - if a database connection string is provided
2. a JSON Web Token - if JWT sessions are enabled (e.g. if no database specified)

However, NextAuth.js does not also handle Access Token rotation for you. If this is something you need, currently you will need to write the logic to handle that yourself. 

_This is something we would like to have support for in future but is not in active development._

---

## Feature Requests

### Why doesn't NextAuth.js support [a particular feature]?

NextAuth.js is an open source project built by individual contributors who are volunteers who writing code and providing support to help folks out in their spare time.

If you would like NextAuth.js to support a particular feature the best way to help make that happen is to raise a feature request describing the feature, and to offer to develop the feature or to pay someone to develop it.

### I disagree with a product design decision, how can I change your mind?

Product design decisions on NextAuth.js are made by core team members.

You can raise suggestions as feature requests / requests for enhancement.

Requests that provide the detail requested in the template and follow the format requested may be more likely to be supported, as additional detail prompted in the templates often provides important context.

Ultimately, you are always free to fork the project under the terms of the ISC License.

---

## JSON Web Tokens 

### What are the advantages of JSON Web Tokens?

JSON Web Tokens can be used for session data, but are also used for lots of other things, such as sending signed objects between services in authentication flows.

Advantages of using a JWT as a session token include that they do not require a database to store sessions and can be faster and cheaper to run and easier to scale. You can also include confidential information directly in a token (such as a shared API key).

Note: NextAuth.js supports both database session tokens and JWT session tokens.

### What are the disadvantages of JSON Web Tokens?

As with database session tokens, JSON Web Tokens are limited in the amount of data you can store in them, typically around 4096 bytes in total for all cookies on a domain, though the exact limit varies between browsers, proxies and hosting services.

You cannot expire a session remotely, so typically shorter session expiry times are used when using JSON Web Tokens as session tokens.

### Why does NextAuth.js encrypt JSON Web Tokens?

JSON Web Tokens are signed (to prevent tampering) and the contents encoded using Base64, but they are not encrypted by default - by design anyone with access to a token can decode it and verify the contents of a token without knowing the secret used to sign it.

When using JSON Web Tokens as Session Tokens, NextAuth.js also encrypts them to allow you to store sensitive data (e.g. API keys or secret tokens) without exposing them to the client that stores them. This is commonly regarded as best practice.

If you want to use tokens that are signed (but not encrypted) so they can be more easily used by other services running on the same domain (and it is secure to do so), you can specify custom JWT encode/decode functions that use signing only.