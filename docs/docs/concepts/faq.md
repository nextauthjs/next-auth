---
id: faq
title: Frequently Asked Questions
---

## About Auth.js

### Is Auth.js commercial software?

Auth.js is an open-source project built by individual contributors.

It is not commercial software and is not associated with a commercial organization.

---

## Compatibility

<details>
<summary>
  <h3 style={{display: "inline-block"}}>What databases does Auth.js support?</h3>
</summary>
<p>

You can use Auth.js with MySQL, MariaDB, Postgres, MongoDB and SQLite or without a database. (See our [using a database adapter guide](/getting-started/adapters)).

You can use also Auth.js with any database using a custom database adapter, or by using a custom credentials authentication provider - e.g. to support signing in with a username and password stored in an existing database.

</p>
</details>

<details>
<summary>
  <h3 style={{display: "inline-block"}}>What authentication services does Auth.js support?</h3>
</summary>

Auth.js includes built-in support for signing in with (See also: [Providers](/reference/core/providers))

Auth.js also supports email for passwordless sign-in, which is useful for account recovery or for people who are not able to use an account with the configured OAuth services (e.g. due to service outage, account suspension or otherwise becoming locked out of an account).

You can also use a custom-based provider to support signing in with a username and password stored in an external database and/or using two-factor authentication.

</details>

<details>
<summary>
  <h3 style={{display: "inline-block"}}>Does Auth.js support signing in with a username and password?</h3>
</summary>
<p>

Auth.js is designed to avoid the need to store passwords for user accounts.

If you have an existing database of usernames and passwords, you can use a custom credentials provider to allow signing in with a username and password stored in an existing database.

_If you use a custom credentials provider user accounts will not be persisted in a database by Auth.js (even if one is configured). The option to use JSON Web Tokens for session tokens (which allow sign-in without using a session database) must be enabled to use a custom credentials provider._

</p>
</details>

<details>
<summary>
  <h3 style={{display: "inline-block"}}>Can I use Auth.js with a website that does not use Next.js?</h3>
</summary>
<p>

Auth.js is designed for use with Next.js and Serverless.

If you are using a different framework for your website, you can create a website that handles sign-in with Next.js and then access those sessions on a website that does not use Next.js as long as the websites are on the same domain.

If you use Auth.js on a website with a different subdomain than the rest of your website (e.g. `auth.example.com` vs `www.example.com`) you will need to set a custom cookie domain policy for the Session Token cookie. (See also: [Cookies](/reference/core#cookies))

Auth.js does not currently support automatically signing into sites on different top-level domains (e.g. `www.example.com` vs `www.example.org`) using a single session.

</p>
</details>

<details>
<summary>
  <h3 style={{display: "inline-block"}}>Can I use Auth.js with React Native?</h3>
</summary>
<p>

Auth.js is designed as a secure, confidential client and implements a server-side authentication flow.

It is not intended to be used in native applications on desktop or mobile applications, which typically implement public clients (e.g. with client/secrets embedded in the application).

</p>
</details>

<details>
<summary>
  <h3 style={{display: "inline-block"}}>Is Auth.js supporting TypeScript?</h3>
</summary>
<p>

Yes! Check out the [TypeScript docs](/getting-started/typescript)

</p>
</details>

<details>
<summary>
  <h3 style={{display: "inline-block"}}>Is Auth.js compatible with Next.js 12 Middleware?</h3>
</summary>
<p>

[Next.js Middleware](https://nextjs.org/docs/middleware) is supported. Head over to [this page](https://next-auth.js.org/configuration/nextjs#middleware)

</p>
</details>

---

## Session strategies

Check out the [Session strategies page](/concepts/session-strategies) to learn more.

---

## Security

Parts of this section have been moved to their [page](/security).

<details>
<summary>
  <h3 style={{display: "inline-block"}}>How do I get Refresh Tokens and Access Tokens for an OAuth account?</h3>
</summary>
<p>

Auth.js provides a solution for authentication, session management and user account creation.

Auth.js records Refresh Tokens and Access Tokens on sign-in (if supplied by the provider) and it will pass them, along with the User ID, Provider and Provider Account ID, to either:

1. A database - if a database connection string is provided
2. The JSON Web Token callback - if JWT sessions are enabled (e.g. if no database is specified)

You can then look them up from the database or persist them to the JSON Web Token.

Note: Auth.js does not currently handle Access Token rotation for OAuth providers for you, however, you can check out [this tutorial](/guides/basics/refresh-token-rotation) if you want to implement it.

</p>
</details>

<details>
<summary>
  <h3 style={{display: "inline-block"}}>When I sign in with another account with the same email address, why are accounts not linked automatically?</h3>
</summary>
<p>

Automatic account linking on sign-in is not secure between arbitrary providers - except for allowing users to sign in via email addresses as a fallback (as they must verify their email address as part of the flow).

When an email address is associated with an OAuth account it does not necessarily mean that it has been verified as belonging to the account holder — how email address verification is handled is not part of the OAuth specification and varies between providers (e.g. some do not verify first, some do verify first, others return metadata indicating the verification status).

With automatic account linking on sign-in, this can be exploited by bad parties to hijack accounts by creating an OAuth account associated with the email address of another user.

For this reason, it is not secure to automatically link accounts between arbitrary providers on sign-in, which is why this feature is generally not provided by an authentication service and is not provided by Auth.js.

Automatic account linking is seen on some sites, sometimes insecurely. It can be technically possible to do automatic account linking securely if you trust all the providers involved to ensure they have securely verified the email address associated with the account, but requires placing trust (and transferring the risk) to those providers to handle the process securely.

Examples of scenarios where this is secure include an OAuth provider you control (e.g. that only authorizes users internal to your organization) or a provider you explicitly trust to have verified the users' email address.

Automatic account linking is not a planned feature of Auth.js, however, there is scope to improve the user experience of account linking and of handling this flow, securely. Typically this involves providing a fallback option to sign in via email, which is already possible (and recommended), but the current implementation of this flow could be improved.

Providing support for secure account linking and unlinking of additional providers - which can only be done if a user is already signed in - was originally a feature in v1.x but has not been present since v2.0, and is planned to return in a future release.

</p>
</details>

---

## Feature Requests

<details>
<summary>
  <h3 style={{display: "inline-block"}}>Why doesn't Auth.js support [a particular feature]?</h3>
</summary>
<p>

Auth.js is an open-source project built by individual contributors who are volunteers writing code and providing support in their spare time.

If you would like Auth.js to support a particular feature, the best way to help make it happen is to raise a feature request describing the feature and offer to work with other contributors to develop and test it.

If you are not able to develop a feature yourself, you can offer to sponsor someone to work on it.

</p>
</details>

<details>
<summary>
  <h3 style={{display: "inline-block"}}>I disagree with a design decision, how can I change your mind?</h3>
</summary>
<p>

Product design decisions on Auth.js are made by core team members.

You can raise suggestions as feature requests for enhancement.

Requests that provide the detail requested in the template and follow the format requested may be more likely to be supported, as additional detail prompted in the templates often provides important context.

Ultimately if your request is not accepted or is not actively in development, you are always free to fork the project under the terms of the ISC License.

</p>
</details>
