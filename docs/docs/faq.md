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

<details>
<summary>
  <h3 style={{display:"inline-block"}}>What databases does NextAuth.js support?</h3>
</summary>
<p>

You can use NextAuth.js with MySQL, MariaDB, Postgres, MongoDB and SQLite or without a database. (See also: [Databases](/configuration/databases))

You can use also NextAuth.js with any database using a custom database adapter, or by using a custom credentials authentication provider - e.g. to support signing in with a username and password stored in an existing database.

</p>
</details>

<details>
<summary>
  <h3 style={{display:"inline-block"}}>What authentication services does NextAuth.js support?</h3>
</summary>
<p>

<p>NextAuth.js includes built-in support for signing in with&nbsp;
{Object.values(require("../providers.json")).sort().join(", ")}.
(See also: <a href="/configuration/providers/oauth">Providers</a>)
</p>

NextAuth.js also supports email for passwordless sign in, which is useful for account recovery or for people who are not able to use an account with the configured OAuth services (e.g. due to service outage, account suspension or otherwise becoming locked out of an account).

You can also use a custom based provider to support signing in with a username and password stored in an external database and/or using two factor authentication.

</p>
</details>

<details>
<summary>
  <h3 style={{display:"inline-block"}}>Does NextAuth.js support signing in with a username and password?</h3>
</summary>
<p>

NextAuth.js is designed to avoid the need to store passwords for user accounts.

If you have an existing database of usernames and passwords, you can use a custom credentials provider to allow signing in with a username and password stored in an existing database.

_If you use a custom credentials provider user accounts will not be persisted in a database by NextAuth.js (even if one is configured). The option to use JSON Web Tokens for session tokens (which allow sign in without using a session database) must be enabled to use a custom credentials provider._

</p>
</details>

<details>
<summary>
  <h3 style={{display:"inline-block"}}>Can I use NextAuth.js with a website that does not use Next.js?</h3>
</summary>
<p>

NextAuth.js is designed for use with Next.js and Serverless.

If you are using a different framework for your website, you can create a website that handles sign in with Next.js and then access those sessions on a website that does not use Next.js as long as the websites are on the same domain.

If you use NextAuth.js on a website with a different subdomain then the rest of your website (e.g. `auth.example.com` vs `www.example.com`) you will need to set a custom cookie domain policy for the Session Token cookie. (See also: [Cookies](/configuration/options#cookies))

NextAuth.js does not currently support automatically signing into sites on different top level domains (e.g. `www.example.com` vs `www.example.org`) using a single session.

</p>
</details>

<details>
<summary>
  <h3 style={{display:"inline-block"}}>Can I use NextAuth.js with React Native?</h3>
</summary>
<p>

NextAuth.js is designed as a secure, confidential client and implements a server side authentication flow.

It is not intended to be used in native applications on desktop or mobile applications, which typically implement public clients (e.g. with client / secrets embedded in the application).

</p>
</details>

<details>
<summary>
  <h3 style={{display:"inline-block"}}>Is NextAuth.js supporting TypeScript?</h3>
</summary>
<p>

Yes! Check out the [TypeScript docs](/getting-started/typescript)

</p>
</details>

<details>
<summary>
  <h3 style={{display:"inline-block"}}>Is NextAuth.js compatible with Next.js 12 Middleware?</h3>
</summary>
<p>

[Next.js Middleware](https://nextjs.org/docs/middleware) is supported. Head over to the [this page](/configuration/nextjs#middleware)

</p>
</details>

---

## Databases

<details>
<summary>
  <h3 style={{display:"inline-block"}}>What databases are supported by NextAuth.js?</h3>
</summary>
<p>

NextAuth.js can be used with MySQL, Postgres, MongoDB, SQLite and compatible databases (e.g. MariaDB, Amazon Aurora, Amazon DocumentDB…) or with no database.

It also provides an Adapter API which allows you to connect it to any database.

</p>
</details>

<details>
<summary>
  <h3 style={{display:"inline-block"}}>What does NextAuth.js use databases for?</h3>
</summary>
<p>

Databases in NextAuth.js are used for persisting users, OAuth accounts, email sign in tokens and sessions.

Specifying a database is optional if you don't need to persist user data or support email sign in. If you don't specify a database then JSON Web Tokens will be enabled for session storage and used to store session data.

If you are using a database with NextAuth.js, you can still explicitly enable JSON Web Tokens for sessions (instead of using database sessions).

</p>
</details>

<details>
<summary>
  <h3 style={{display:"inline-block"}}>Should I use a database?</h3>
</summary>
<p>

- Using NextAuth.js without a database works well for internal tools - where you need to control who is able to sign in, but when you do not need to create user accounts for them in your application.

- Using NextAuth.js with a database is usually a better approach for a consumer facing application where you need to persist accounts (e.g. for billing, to contact customers, etc).

</p>
</details>

<details>
<summary>
  <h3 style={{display:"inline-block"}}>What database should I use?</h3>
</summary>
<p>

Managed database solutions for MySQL, Postgres and MongoDB (and compatible databases) are well supported from cloud providers such as Amazon, Google, Microsoft and Atlas.

If you are deploying directly to a particular cloud platform you may also want to consider serverless database offerings they have (e.g. [Amazon Aurora Serverless on AWS](https://aws.amazon.com/rds/aurora/serverless/)).

</p>
</details>

---

## Security

Parts of this section has been moved to its [own page](/security).

<details>
<summary>
  <h3 style={{display:"inline-block"}}>How do I get Refresh Tokens and Access Tokens for an OAuth account?</h3>
</summary>
<p>

NextAuth.js provides a solution for authentication, session management and user account creation.

NextAuth.js records Refresh Tokens and Access Tokens on sign in (if supplied by the provider) and it will pass them, along with the User ID, Provider and Provider Account ID, to either:

1. A database - if a database connection string is provided
2. The JSON Web Token callback - if JWT sessions are enabled (e.g. if no database specified)

You can then look them up from the database or persist them to the JSON Web Token.

Note: NextAuth.js does not currently handle Access Token rotation for OAuth providers for you, however you can check out [this tutorial](/tutorials/refresh-token-rotation) if you want to implement it.

We also have an [example repository](https://github.com/nextauthjs/next-auth-refresh-token-example) / project based upon NextAuth.js v4 where we demonstrate how to use a refresh token to refresh the provided access token.

</p>
</details>

<details>
<summary>
  <h3 style={{display:"inline-block"}}>When I sign in with another account with the same email address, why are accounts not linked automatically?</h3>
</summary>
<p>

Automatic account linking on sign in is not secure between arbitrary providers - with the exception of allowing users to sign in via an email addresses as a fallback (as they must verify their email address as part of the flow).

When an email address is associated with an OAuth account it does not necessarily mean that it has been verified as belonging to account holder — how email address verification is handled is not part of the OAuth specification and varies between providers (e.g. some do not verify first, some do verify first, others return metadata indicating the verification status).

With automatic account linking on sign in, this can be exploited by bad actors to hijack accounts by creating an OAuth account associated with the email address of another user.

For this reason it is not secure to automatically link accounts between arbitrary providers on sign in, which is why this feature is generally not provided by authentication service and is not provided by NextAuth.js.

Automatic account linking is seen on some sites, sometimes insecurely. It can be technically possible to do automatic account linking securely if you trust all the providers involved to ensure they have securely verified the email address associated with the account, but requires placing trust (and transferring the risk) to those providers to handle the process securely.

Examples of scenarios where this is secure include with an OAuth provider you control (e.g. that only authorizes users internal to your organization) or with a provider you explicitly trust to have verified the users email address.

Automatic account linking is not a planned feature of NextAuth.js, however there is scope to improve the user experience of account linking and of handling this flow, in a secure way. Typically this involves providing a fallback option to sign in via email, which is already possible (and recommended), but the current implementation of this flow could be improved on.

Providing support for secure account linking and unlinking of additional providers - which can only be done if a user is already signed in already - was originally a feature in v1.x but has not been present since v2.0, is planned to return in a future release.

</p>
</details>

---

## Feature Requests

<details>
<summary>
  <h3 style={{display:"inline-block"}}>Why doesn't NextAuth.js support [a particular feature]?</h3>
</summary>
<p>

NextAuth.js is an open source project built by individual contributors who are volunteers writing code and providing support in their spare time.

If you would like NextAuth.js to support a particular feature, the best way to help make it happen is to raise a feature request describing the feature and offer to work with other contributors to develop and test it.

If you are not able to develop a feature yourself, you can offer to sponsor someone to work on it.

</p>
</details>

<details>
<summary>
  <h3 style={{display:"inline-block"}}>I disagree with a design decision, how can I change your mind?</h3>
</summary>
<p>

Product design decisions on NextAuth.js are made by core team members.

You can raise suggestions as feature requests / requests for enhancement.

Requests that provide the detail requested in the template and follow the format requested may be more likely to be supported, as additional detail prompted in the templates often provides important context.

Ultimately if your request is not accepted or is not actively in development, you are always free to fork the project under the terms of the ISC License.

</p>
</details>

---

## JSON Web Tokens

<details>
<summary>
  <h3>Does NextAuth.js use JSON Web Tokens?</h3>
</summary>
<p>

NextAuth.js by default uses JSON Web Tokens for saving the user's session. However, if you use a [database adapter](/adapters/overview), the database will be used to persist the user's session. You can force the usage of JWT when using a database [through the configuration options](/configuration/options#session). Since v4 all our JWT tokens are now encrypted by default with A256GCM.

</p>
</details>

<details>
<summary>
  <h3>What are the advantages of JSON Web Tokens?</h3>
</summary>
<p>

JSON Web Tokens can be used for session tokens, but are also used for lots of other things, such as sending signed objects between services in authentication flows.

- Advantages of using a JWT as a session token include that they do not require a database to store sessions, this can be faster and cheaper to run and easier to scale.

- JSON Web Tokens in NextAuth.js are secured using cryptographic encryption (JWE) to store the included information directly in a JWT session token. You may then use the token to pass information between services and APIs on the same domain without having to contact a database to verify the included information.

- You can use JWT to securely store information you do not mind the client knowing even without encryption, as the JWT is stored in a server-readable-only cookie so data in the JWT is not accessible to third party JavaScript running on your site.

</p>
</details>

<details>
<summary>
  <h3>What are the disadvantages of JSON Web Tokens?</h3>
</summary>
<p>

- You cannot as easily expire a JSON Web Token - doing so requires maintaining a server side blocklist of invalid tokens (at least until they expire) and checking every token against the list every time a token is presented.

  Shorter session expiry times are used when using JSON Web Tokens as session tokens to allow sessions to be invalidated sooner and simplify this problem.

  NextAuth.js client includes advanced features to mitigate the downsides of using shorter session expiry times on the user experience, including automatic session token rotation, optionally sending keep alive messages to prevent short lived sessions from expiring if there is an window or tab open, background re-validation, and automatic tab/window syncing that keeps sessions in sync across windows any time session state changes or a window or tab gains or loses focus.

- As with database session tokens, JSON Web Tokens are limited in the amount of data you can store in them. There is typically a limit of around 4096 bytes per cookie, though the exact limit varies between browsers, proxies and hosting services. If you want to support most browsers, then do not exceed 4096 bytes per cookie. If you want to save more data, you will need to persist your sessions in a database (Source: [browsercookielimits.iain.guru](http://browsercookielimits.iain.guru/))

  The more data you try to store in a token and the more other cookies you set, the closer you will come to this limit. Since v4 we have implemented cookie chunking so that cookies over the 4kb limit get split and reassembled upon parsing. However since this data needs to be transmitted on every request, if you wish to store more than ~4 KB of data you're probably at the point where you want to store a unique ID in the token and persist the data elsewhere (e.g. in a server-side key/value store).

- Data stored in an encrypted JSON Web Token (JWE) may be compromised at some point.

  Even if appropriately configured, information stored in an encrypted JWT should not be assumed to be impossible to decrypt at some point - e.g. due to the discovery of a defect or advances in technology.

  Avoid storing any data in a token that might be problematic if it were to be decrypted in the future.

- If you do not explicitly specify a secret for for NextAuth.js, existing sessions will be invalidated any time your NextAuth.js configuration changes, as NextAuth.js will default to an auto-generated secret. Since v4 this only impacts development and generating a secret is required in production.


</p>
</details>

<details>
<summary>
  <h3>Are JSON Web Tokens secure?</h3>
</summary>
<p>

By default tokens are not signed (JWS) but are encrypted (JWE). Since v4 we have implemented cookie chunking so that cookies over the 4kb limit get split and reassembled upon parsing.

You can specify other valid algorithms - [as specified in RFC 7518](https://tools.ietf.org/html/rfc7517) - with either a secret (for symmetric encryption) or a public/private key pair (for asymmetric encryption).

NextAuth.js will generate keys for you, but this will generate a warning at start up.

Using explicit public/private keys for signing is strongly recommended.

</p>
</details>

<details>
<summary>
  <h3>What signing and encryption standards does NextAuth.js support?</h3>
</summary>
<p>

NextAuth.js includes a largely complete implementation of JSON Object Signing and Encryption (JOSE):

- [RFC 7515 - JSON Web Signature (JWS)](https://tools.ietf.org/html/rfc7515)
- [RFC 7516 - JSON Web Encryption (JWE)](https://tools.ietf.org/html/rfc7516)
- [RFC 7517 - JSON Web Key (JWK)](https://tools.ietf.org/html/rfc7517)
- [RFC 7518 - JSON Web Algorithms (JWA)](https://tools.ietf.org/html/rfc7518)
- [RFC 7519 - JSON Web Token (JWT)](https://tools.ietf.org/html/rfc7519)

This incorporates support for:

- [RFC 7638 - JSON Web Key Thumbprint](https://tools.ietf.org/html/rfc7638)
- [RFC 7787 - JSON JWS Unencoded Payload Option](https://tools.ietf.org/html/rfc7797)
- [RFC 8037 - CFRG Elliptic Curve ECDH and Signatures](https://tools.ietf.org/html/rfc8037)

</p>
</details>
