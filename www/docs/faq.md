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

You can use NextAuth.js with MySQL, MariaDB, Postgres, MongoDB and SQLite or without a database. (See also: [Databases](/configuration/databases))

You can use also NextAuth.js with any database using a custom database adapter, or by using a custom credentials authentication provider - e.g. to support signing in with a username and password stored in an existing database.

### What authentication services does NextAuth.js support?


<p>NextAuth.js includes built-in support for signing in with&nbsp;
{Object.values(require("../providers.json")).sort().join(", ")}.
(See also: <a href="/configuration/providers">Providers</a>)
</p>


NextAuth.js also supports email for passwordless sign in, which is useful for account recovery or for people who are not able to use an account with the configured OAuth services (e.g. due to service outage, account suspension or otherwise becoming locked out of an account).

You can also use a custom based provider to support signing in with a username and password stored in an external database and/or using two factor authentication.

### Does NextAuth.js support signing in with a username and password?

NextAuth.js is designed to avoid the need to store passwords for user accounts.

If you have an existing database of usernames and passwords, you can use a custom credentials provider to allow signing in with a username and password stored in an existing database.

_If you use a custom credentials provider user accounts will not be persisted in a database by NextAuth.js (even if one is configured). The option to use JSON Web Tokens for session tokens (which allow sign in without using a session database) must be enabled to use a custom credentials provider._

### Can I use NextAuth.js with a website that does not use Next.js?

NextAuth.js is designed for use with Next.js and Serverless.

If you are using a different framework for you website, you can create a website that handles sign in with Next.js and then access those sessions on a website that does not use Next.js as long as the websites are on the same domain.

If you use NextAuth.js on a website with a different subdomain then the rest of your website (e.g. `auth.example.com` vs `www.example.com`) you will need to set a custom cookie domain policy for the Session Token cookie. (See also: [Cookies](/configuration/options#cookies))

NextAuth.js does not currently support automatically signing into sites on different top level domains (e.g. `www.example.com` vs `www.example.org`) using a single session.

### Can I use NextAuth.js with React Native?

NextAuth.js is designed as a secure, confidential client and implements a server side authentication flow.

It is not intended to be used in native applications on desktop or mobile applications, which typically implement public clients (e.g. with client / secrets embedded in the application).


### Is NextAuth.js supporting TypeScript?

Yes! Check out the [TypeScript docs](/getting-started/typescript)

---

## Databases

### What databases are supported by NextAuth.js?

NextAuth.js can be used with MySQL, Postgres, MongoDB, SQLite and compatible databases (e.g. MariaDB, Amazon Aurora, Amazon DocumentDB…) or with no database.

It also provides an Adapter API which allows you to connect it to any database.

### What does NextAuth.js use databases for?

Databases in NextAuth.js are used for persisting users, OAuth accounts, email sign in tokens and sessions.

Specifying a database is optional if you don't need to persist user data or support email sign in. If you don't specify a database then JSON Web Tokens will be enabled for session storage and used to store session data.

If you are using a database with NextAuth.js, you can still explicitly enable JSON Web Tokens for sessions (instead of using database sessions).

### Should I use a database?

* Using NextAuth.js without a database works well for internal tools - where you need to control who is able to sign in, but when you do not need to create user accounts for them in your application.

* Using NextAuth.js with a database is usually a better approach for a consumer facing application where you need to persist accounts (e.g. for billing, to contact customers, etc).

### What database should I use?

Managed database solutions for MySQL, Postgres and MongoDB (and compatible databases) are well supported from cloud providers such as Amazon, Google, Microsoft and Atlas.

If you are deploying directly to a particular cloud platform you may also want to consider serverless database offerings they have (e.g. [Amazon Aurora Serverless on AWS](https://aws.amazon.com/rds/aurora/serverless/)).


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

NextAuth.js records Refresh Tokens and Access Tokens on sign in (if supplied by the provider) and it will pass them, along with the User ID, Provider and Provider Account ID, to either:

1. A database - if a database connection string is provided
2. The JSON Web Token callback - if JWT sessions are enabled (e.g. if no database specified)

You can then look them up from the database or persist them to the JSON Web Token.

Note: NextAuth.js does not currently handle Access Token rotation for OAuth providers for you, however you can check out [this tutorial](/tutorials/refresh-token-rotation) if you want to implement it.

### When I sign in with another account with the same email address, why are accounts not linked automatically?

Automatic account linking on sign in is not secure between arbitrary providers - with the exception of allowing users to sign in via an email addresses as a fallback (as they must verify their email address as part of the flow).

When an email address is associated with an OAuth account it does not necessarily mean that it has been verified as belonging to account holder — how email address verification is handled is not part of the OAuth specification and varies between providers (e.g. some do not verify first, some do verify first, others return metadata indicating the verification status).

With automatic account linking on sign in, this can be exploited by bad actors to hijack accounts by creating an OAuth account associated with the email address of another user.

For this reason it is not secure to automatically link accounts between arbitrary providers on sign in, which is why this feature is generally not provided by authentication service and is not provided by NextAuth.js.

Automatic account linking is seen on some sites, sometimes insecurely. It can be technically possible to do automatic account linking securely if you trust all the providers involved to ensure they have securely verified the email address associated with the account, but requires placing trust (and transferring the risk) to those providers to handle the process securely.

Examples of scenarios where this is secure include with an OAuth provider you control (e.g. that only authorizes users internal to your organization) or with a provider you explicitly trust to have verified the users email address.

Automatic account linking is not a planned feature of NextAuth.js, however there is scope to improve the user experience of account linking and of handling this flow, in a secure way. Typically this involves providing a fallback option to sign in via email, which is already possible (and recommended), but the current implementation of this flow could be improved on.

Providing support for secure account linking and unlinking of additional providers - which can only be done if a user is already signed in already - was originally a feature in v1.x but has not been present since v2.0, is planned to return in a future release.

---

## Feature Requests

### Why doesn't NextAuth.js support [a particular feature]?

NextAuth.js is an open source project built by individual contributors who are volunteers writing code and providing support in their spare time.

If you would like NextAuth.js to support a particular feature, the best way to help make it happen is to raise a feature request describing the feature and offer to work with other contributors to develop and test it.

If you are not able to develop a feature yourself, you can offer to sponsor someone to work on it.

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

You can also choose to use JSON Web Tokens as session tokens with using a database, by explicitly setting the `session: { jwt: true }` option.

### What are the advantages of JSON Web Tokens?

JSON Web Tokens can be used for session tokens, but are also used for lots of other things, such as sending signed objects between services in authentication flows.

* Advantages of using a JWT as a session token include that they do not require a database to store sessions, this can be faster and cheaper to run and easier to scale.

* JSON Web Tokens in NextAuth.js are secured using cryptographic signing (JWS) by default and it is easy for services and API endpoints to verify tokens without having to contact a database to verify them.

* You can enable encryption (JWE) to store include information directly in a JWT session token that you wish to keep secret and use the token to pass information between services / APIs on the same domain.

* You can use JWT to securely store information you do not mind the client knowing even without encryption, as the JWT is stored in an server-readable-only-token so data in the JWT is not accessible to third party JavaScript running on your site.

### What are the disadvantages of JSON Web Tokens?

* You cannot as easily expire a JSON Web Token - doing so requires maintaining a server side blocklist of invalid tokens (at least until they expire) and checking every token against the list every time a token is presented.

  Shorter session expiry times are used when using JSON Web Tokens as session tokens to allow sessions to be invalidated sooner and simplify this problem.

  NextAuth.js client includes advanced features to mitigate the downsides of using shorter session expiry times on the user experience, including automatic session token rotation, optionally sending keep alive messages to prevent short lived sessions from expiring if there is an window or tab open, background re-validation, and automatic tab/window syncing that keeps sessions in sync across windows any time session state changes or a window or tab gains or loses focus.

* As with database session tokens, JSON Web Tokens are limited in the amount of data you can store in them. There is typically a limit of around 4096 bytes per cookie, though the exact limit varies between browsers, proxies and hosting services. If you want to support most browsers, then do not exceed 4096 bytes per cookie. If you want to save more data, you will need to persist your sessions in a database (Source: [browsercookielimits.iain.guru](http://browsercookielimits.iain.guru/))

  The more data you try to store in a token and the more other cookies you set, the closer you will come to this limit. If you wish to store more than ~4 KB of data you're probably at the point where you need to store a unique ID in the token and persist the data elsewhere (e.g. in a server-side key/value store).

* Data stored in an encrypted JSON Web Token (JWE) may be compromised at some point.

  Even if appropriately configured, information stored in an encrypted JWT should not be assumed to be impossible to decrypt at some point - e.g. due to the discovery of a defect or advances in technology.

  Avoid storing any data in a token that might be problematic if it were to be decrypted in the future.

* If you do not explicitly specify a secret for for NextAuth.js, existing sessions will be invalidated any time your NextAuth.js configuration changes, as NextAuth.js will default to an auto-generated secret.

  If using JSON Web Token you should at least specify a secret and ideally configure public/private keys.

### Are JSON Web Tokens secure?

By default tokens are signed (JWS) but not encrypted (JWE), as encryption adds additional overhead and reduces the amount of space available to store data (total cookie size for a domain is limited to 4KB).

* JSON Web Tokens in NextAuth.js use JWS and are signed using HS512 with an auto-generated key.

* If encryption is enabled by setting `jwt: { encrypt: true }` option then the JWT will _also_ use JWE to encrypt the token, using A256GCM with an auto-generated key.

You can specify other valid algorithms - [as specified in RFC 7518](https://tools.ietf.org/html/rfc7517) - with either a  secret (for symmetric encryption) or a public/private key pair (for a symmetric encryption).

NextAuth.js will generate keys for you, but this will generate a warning at start up.

Using explicit public/private keys for signing is strongly recommended.

### What signing and encryption standards does NextAuth.js support?

NextAuth.js includes a largely complete implementation of JSON Object Signing and Encryption (JOSE):

* [RFC 7515 - JSON Web Signature (JWS)](https://tools.ietf.org/html/rfc7515)
* [RFC 7516 - JSON Web Encryption (JWE)](https://tools.ietf.org/html/rfc7516)
* [RFC 7517 - JSON Web Key (JWK)](https://tools.ietf.org/html/rfc7517)
* [RFC 7518 - JSON Web Algorithms (JWA)](https://tools.ietf.org/html/rfc7518)
* [RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)

This incorporates support for:

* [RFC 7638 - JSON Web Key Thumbprint](https://tools.ietf.org/html/rfc7638)
* [RFC 7787 - JSON JWS Unencoded Payload Option](https://tools.ietf.org/html/rfc7797)
* [RFC 8037 - CFRG Elliptic Curve ECDH and Signatures](https://tools.ietf.org/html/rfc8037)
